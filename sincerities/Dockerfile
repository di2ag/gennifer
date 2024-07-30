FROM r-base:4.2.2

RUN apt-get update && apt-get install -y time python3-pip 
RUN apt-get install time
# RUN apt-get install libxml2  --gcc libxml2 libodbc1
RUN groupadd gennifer_user && useradd -ms /bin/bash -g gennifer_user gennifer_user

# Set the working directory to /app
WORKDIR /app

COPY ./requirements.txt /app

# Install the required packages
RUN pip3 install --no-cache-dir --break-system-packages --upgrade setuptools
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# chown all the files to the app user
RUN chown -R gennifer_user:gennifer_user /app

USER root

RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/iterators/iterators_1.0.13.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/foreach/foreach_1.5.1.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/SuppDists_1.1-9.7.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/versions_0.3.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/glmnet/glmnet_2.0-13.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/kSamples/kSamples_1.2-9.tar.gz',type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/ppcor_1.1.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/pracma/pracma_2.2.9.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/R.matlab/R.matlab_3.6.2.tar.gz', type='source')"
RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/cvTools/cvTools_0.3.2.tar.gz', type='source')"
# RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/kSamples/kSamples_1.2-9.tar.gz', dependencies=TRUE, type='source'); if (!library(kSamples, logical.return=T)) quit(status=10)"
RUN apt-get update && apt-get install -y time

USER gennifer_user

COPY . /app

# Start the Flask app
CMD ["flask", "--app", "sincerities", "run", "--host", "0.0.0.0", "--debug"]