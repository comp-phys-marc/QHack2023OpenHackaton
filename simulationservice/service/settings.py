import os
from dotenv import load_dotenv
from pathlib import Path


class Settings:

    def __init__(self):
        env_path = str(Path('.')) + '/.env'
        load_dotenv(dotenv_path=env_path)

    def __getattr__(self, item):
        return os.getenv(item.upper())
