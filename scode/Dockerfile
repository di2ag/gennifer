FROM r-base:4.2.2

RUN apt-get update && apt-get install -y time python3-pip gcc git ruby
RUN apt-get install time

# add app user
RUN groupadd gennifer_user && useradd -ms /bin/bash -g gennifer_user gennifer_user

# Set the working directory to /app
WORKDIR /app

COPY ./requirements.txt /app

# Install the required packages
RUN pip3 install --no-cache-dir --break-system-packages --upgrade setuptools
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# chown all the files to the app user
RUN chown -R gennifer_user:gennifer_user /app

USER gennifer_user

RUN git clone https://github.com/hmatsu1226/SCODE

WORKDIR /app/SCODE

RUN git checkout a0512f8ec29aac188c9c27a8e89ddd2464e6d84d

USER root

RUN R -e "install.packages('https://cran.r-project.org/src/contrib/MASS_7.3-51.3.tar.gz', type = 'source')"

USER gennifer_user

# RUN ruby run_R.rb data/exp_train.txt data/time_train.txt out 100 4 356 100 2

WORKDIR /app

RUN mkdir data/

# Copy the current directory contents into the container at /app
COPY . /app

# Start the Flask app
CMD ["flask", "--app", "scode", "run", "--host", "0.0.0.0", "--debug"]