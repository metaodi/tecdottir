#!/bin/bash

[ ! -d pyenv ] && python3 -m venv pyenv
source pyenv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
pip install -e .
