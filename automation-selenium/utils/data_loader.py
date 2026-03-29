import json
from pathlib import Path
from typing import Any, Dict

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"


def load_json(file_name: str) -> Dict[str, Any]:
    file_path = DATA_DIR / file_name
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_test_data() -> Dict[str, Any]:
    return load_json("test_data.json")


def get_additional_test_data() -> Dict[str, Any]:
    return load_json("test_data_additional.json")


def get_auth_data() -> Dict[str, Any]:
    return load_json("auth.json")
