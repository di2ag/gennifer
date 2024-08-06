# #This is the base image upon which necessary libraries are installed
FROM python:3.8  

RUN apt-get update && apt-get install -y python3-pip time gcc r-base

# add app user
RUN groupadd gennifer_user && useradd -ms /bin/bash -g gennifer_user gennifer_user

# Set the working directory to /app
WORKDIR /app

COPY ./requirements.txt /app

USER root

# Install the required packages
RUN pip3 install --no-cache-dir --break-system-packages --upgrade setuptools

RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# chown all the files to the app user
RUN chown -R gennifer_user:gennifer_user /app

USER gennifer_user

#Install pcaPP to use zero inflated Kendall tau as a kernel
USER root
RUN Rscript -e "install.packages('https://cran.r-project.org/src/contrib/Archive/mvtnorm/mvtnorm_1.2-4.tar.gz', type='source')"
RUN Rscript -e "install.packages('https://cran.r-project.org/src/contrib/Archive/pcaPP/pcaPP_2.0-3.tar.gz', type='source')"



USER gennifer_user

WORKDIR /app

COPY . /app


CMD ["flask", "--app", "scsgl", "run", "--host", "0.0.0.0", "--debug"]