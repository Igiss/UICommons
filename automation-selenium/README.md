# Selenium Python Automation (POM + Pytest)

This project is a minimal Selenium automation framework for a student project.

## Prerequisites

Install these first in VS Code:

- Python extension: ms-python.python
- Pylance extension: ms-python.vscode-pylance

Install on machine:

- Python 3.10+
- Google Chrome

## Install Dependencies

Run from this folder:

```bash
pip install -r requirements.txt
```

## Configure Auth Token

Update data/auth.json:

- token_key
- token_value
- base_url
- storage (cookie or localStorage)

Token flow:

1. Login manually on browser.
2. Open DevTools (F12).
3. Get token in Application tab from Cookies or LocalStorage.
4. Paste into data/auth.json.

## Folder Purpose

- pages/: Page Object classes.
- tests/: pytest test files for requested test cases.
- data/: input JSON files, including auth.json and test_data.json.
- utils/: shared helpers such as JSON data loader.
- config/: environment settings (optional for extension).
- reports/: generated report.html after pytest run.

## Run Tests

Run all tests:

```bash
pytest
```

Run by group marker:

```bash
pytest -m elements
pytest -m comments
pytest -m export
pytest -m settings
```

## Notes

- All waits use explicit wait via WebDriverWait.
- BasePage includes token injection login method.
- Iframe preview handling is supported in ElementPage.
- Update locators in page classes to match your real UI (data-testid is currently used as placeholder).
