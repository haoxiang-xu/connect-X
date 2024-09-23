FROM python:3.11

WORKDIR /app

COPY requirements.txt .

# Install system dependencies required for h5py (including HDF5 libraries)
RUN apt-get update && apt-get install -y \
    libhdf5-dev \
    libhdf5-serial-dev \
    hdf5-tools \
    libhdf5-103 \
    && apt-get clean

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "BACK.py"]
