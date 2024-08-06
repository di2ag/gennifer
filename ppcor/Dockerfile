FROM r-base:4.2.2

RUN apt-get update && apt-get install -y python3-pip time 

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

RUN R -e "install.packages('https://cran.r-project.org/src/contrib/ppcor_1.1.tar.gz', type = 'source')"

USER gennifer_user

COPY . /app

CMD ["flask", "--app", "ppcor", "run", "--host", "0.0.0.0", "--debug"]