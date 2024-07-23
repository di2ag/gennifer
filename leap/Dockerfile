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

USER root

RUN R -e "install.packages('https://cran.r-project.org/src/contrib/Archive/LEAP/LEAP_0.2.tar.gz', type='source')"

USER gennifer_user

RUN mkdir data/

# Copy the current directory contents into the container at /app
COPY . /app

# Start the Flask app
CMD ["flask", "--app", "leap", "run", "--host", "0.0.0.0", "--debug"]