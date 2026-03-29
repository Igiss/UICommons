from typing import Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from pages.base_page import BasePage


class ElementPage(BasePage):
    POPUP_OVERLAY: Tuple[str, str] = (By.CSS_SELECTOR, ".popup-overlay")
    CATEGORY_CONTINUE_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".popup-modern .continue-btn")
    TITLE_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, ".form-group input[type='text']")
    HTML_TAB_BUTTON: Tuple[str, str] = (By.XPATH, "//button[contains(@class, 'tabs__button') and normalize-space()='HTML']")
    CSS_TAB_BUTTON: Tuple[str, str] = (By.XPATH, "//button[contains(@class, 'tabs__button') and normalize-space()='CSS']")
    CODEMIRROR_EDITABLE: Tuple[str, str] = (By.CSS_SELECTOR, ".tabs__content .cm-content[contenteditable='true']")
    SAVE_DRAFT_BUTTON: Tuple[str, str] = (By.XPATH, "//div[contains(@class,'form-actions')]//button[contains(@class,'secondary') and contains(., 'Save as draft')]")
    CHANGE_TYPE_BUTTON: Tuple[str, str] = (By.XPATH, "//div[contains(@class,'form-actions')]//button[contains(@class,'secondary') and contains(., 'Change type')]")
    SUBMIT_BUTTON: Tuple[str, str] = (By.CSS_SELECTOR, ".form-actions .action-btn.primary")
    ERROR_MESSAGE: Tuple[str, str] = (By.CSS_SELECTOR, ".form-error")
    PREVIEW_IFRAME: Tuple[str, str] = (By.CSS_SELECTOR, "iframe.preview-iframe")

    def open_add_element(self, base_url: str) -> None:
        self.open(f"{base_url}/elements/new")

    def select_category(self, category: str) -> None:
        if not category:
            return
        item_locator = (
            By.XPATH,
            f"//div[contains(@class, 'popup-item')]//span[translate(normalize-space(text()), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='{category.lower()}']",
        )
        self.click(item_locator)
        self.click(self.CATEGORY_CONTINUE_BUTTON)

    def is_category_continue_disabled(self) -> bool:
        button = self.find(self.CATEGORY_CONTINUE_BUTTON)
        return bool(button.get_attribute("disabled"))

    def _set_editor_content(self, value: str) -> None:
        editor = self.find(self.CODEMIRROR_EDITABLE)
        editor.click()
        editor.send_keys(Keys.CONTROL, "a")
        editor.send_keys(Keys.DELETE)
        if value:
            editor.send_keys(value)

    def fill_element_form(self, category: str, title: str, html: str, css: str, desc: str = "") -> None:
        self.select_category(category)
        self.type(self.TITLE_INPUT, title)
        self.click(self.HTML_TAB_BUTTON)
        self._set_editor_content(html)
        self.click(self.CSS_TAB_BUTTON)
        self._set_editor_content(css)

    def submit(self) -> None:
        self.click(self.SUBMIT_BUTTON)

    def save_as_draft(self) -> None:
        self.click(self.SAVE_DRAFT_BUTTON)

    def click_change_type(self) -> None:
        self.click(self.CHANGE_TYPE_BUTTON)

    def get_error(self) -> str:
        return self.get_text(self.ERROR_MESSAGE)

    def preview_contains_text(self, text: str) -> bool:
        iframe = self.find(self.PREVIEW_IFRAME)
        srcdoc = iframe.get_attribute("srcdoc") or ""
        return text in srcdoc

    def is_popup_visible(self) -> bool:
        return self.is_visible(self.POPUP_OVERLAY)

    def get_title_value(self) -> str:
        return self.get_attribute(self.TITLE_INPUT, "value")
