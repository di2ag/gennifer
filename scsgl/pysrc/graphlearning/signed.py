# scSGL - a python package for fene regulatory network inference using graph signal processing based
# signed graph learning
# Copyright (C) 2021 Abdullah Karaaslanli <evdilak@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import numpy as np

from numba import njit
from scipy.sparse import csr_matrix

@njit
def _rowsum_mat_entries(n):
    M = int(n*(n-1)) # number of non-diagonel entries in the matrix
    rows = np.zeros((M, ), dtype=np.int64)
    cols = np.zeros((M, ), dtype=np.int64)
    
    offset_1 = 0 # column offset for block of ones in rows
    offset_2 = 0 # column offset for individual ones in rows
    indx = 0
    
    for row in range(n):
        rows[indx:(indx+n-row-1)] = row
        cols[indx:(indx+n-row-1)] = offset_1 + np.arange(n-row-1)
        
        indx += n-row-1
        offset_1 += n-row-1
        
        if row>0:
            rows[indx:(indx+n-row)] = np.arange(row, n)
            cols[indx:(indx+n-row)] = offset_2 + np.arange(n-row)
            
            indx += n-row
            offset_2 += n-row
    return rows, cols


def _rowsum_mat(n):   
    rows, cols = _rowsum_mat_entries(n)
    M = len(rows)
    return csr_matrix((np.ones((M, )), (rows, cols)), shape=(n, int(M/2))) 

@njit
def _vw_step(yv, yw):
    M = len(yv)
    v = np.zeros((M, 1))
    w = np.zeros((M, 1))
    for i in range(M):
        if yv[i] < 0 and yw[i] < 0:
            if yv[i] < yw[i]:
                v[i] = yv[i]
            else:
                w[i] = yw[i]
        elif yv[i] < 0 and yw[i] > 0:
            v[i] = yv[i]
        elif yv[i] > 0 and yw[i] < 0:
            w[i] = yw[i]

    return v, w

def _l_step(y, P, alpha, rho, n, m):
    beta2 = 4*alpha + rho
    rho1 = 2*alpha
    a = 1/beta2
    b = (4*rho1**2)/(beta2*(beta2 + rho1*(n-2))*(beta2 + 2*rho1*(n-1)))
    c = - rho1/(beta2*(beta2 + rho1*(n-2)))

    y = a*y + b*np.sum(y) + c*(P.T@(P@y))

    return y - (n + np.sum(y))/m


def learn(k, d, alpha1, alpha2, rho=10, max_iter=10000, lpos_init=None, lneg_init=None):
    # TODO: Docstring and clean
    # TODO: What is optimal rho

    rng = np.random.default_rng()

    # Convert k and d to column vector if they are not already
    if np.ndim(k) == 1:
        k = k[..., None]
    
    if np.ndim(d) == 1:
        d = d[..., None]

    M = len(k) # number of node pairs
    n = len(d) # number of nodes

    P = _rowsum_mat(n)

    # Data vector for ADMM
    z = 2*k - P.T@d

    # Initialization
    if lpos_init is None:
        lpos = rng.uniform(0, 1, (M, 1))
        lneg = rng.uniform(0, 1, (M, 1))
        lpos -= (n + np.sum(lpos))/M
        lneg -= (n + np.sum(lneg))/M

        lambda_pos = rng.uniform(0, 1, (M, 1))
        lambda_neg = rng.uniform(0, 1, (M, 1))
    elif lpos_init=="zeros":
        lpos = np.zeros((M, 1))
        lneg = np.zeros((M, 1))
        lambda_pos = np.zeros((M, 1))
        lambda_neg = np.zeros((M, 1))

    lagrangian = np.zeros(max_iter)

    # ADMM iterations
    for iter in range(max_iter):
        # v, w steps
        yv = lpos - lambda_pos/rho
        yw = lneg - lambda_neg/rho
        v, w = _vw_step(yv, yw)

        # positive l step
        if alpha1 > 0:
            y = rho*v + lambda_pos - z
            lpos = _l_step(y, P, alpha1, rho, n, M)

        # negative l step
        if alpha2 > 0:
            y = rho*w + lambda_neg + z
            lneg = _l_step(y, P, alpha2, rho, n, M)

        # multipliers update
        lambda_pos += rho*(v - lpos)
        lambda_neg += rho*(w - lneg)

        # Calculate augmented lagrangian
        lagrangian[iter] = ((z.T@lpos).item() - (z.T@lneg).item() 
                            + 2*alpha1*np.linalg.norm(lpos)**2
                            + alpha1*np.linalg.norm(P@lpos)**2
                            + 2*alpha2*np.linalg.norm(lneg)**2
                            + alpha2*np.linalg.norm(P@lneg)**2
                            + (rho/2)*np.linalg.norm(v - lpos + lambda_pos/rho)**2
                            + (rho/2)*np.linalg.norm(w - lneg + lambda_neg/rho)**2
                            - (2/rho)*np.linalg.norm(lambda_pos)**2
                            - (2/rho)*np.linalg.norm(lambda_neg)**2)

        if iter > 0:
            if abs(lagrangian[iter]/lagrangian[iter-1]-1)<1e-6:
                lagrangian = lagrangian[:iter]
                break

    v[v>-1e-4] = 0
    w[w>-1e-4] = 0
    v = np.abs(v)
    w = np.abs(w)
    return v, w