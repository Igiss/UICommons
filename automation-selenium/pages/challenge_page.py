from typing import List, Tuple

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from pages.base_page import BasePage


class ChallengePage(BasePage):
    """Page object for Challenges list, detail, admin management and rating."""

    # ── Admin Challenges Page ──
    BTN_CREATE: Tuple[str, str] = (By.CSS_SELECTOR, ".btn-create")
    MODAL_CONTENT: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-content")
    MODAL_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-content h2")

    # Create Challenge Form
    FORM_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".form-group input[type='text']")
    FORM_DESCRIPTION: Tuple[str, str] = (By.CSS_SELECTOR, ".form-group textarea")
    FORM_BANNER_URL: Tuple[str, str] = (By.CSS_SELECTOR, ".form-group input[type='url']")
    FORM_START_DATE: Tuple[str, str] = (By.XPATH, "//label[contains(text(),'Start Date')]/following-sibling::input")
    FORM_END_DATE: Tuple[str, str] = (By.XPATH, "//label[contains(text(),'End Date')]/following-sibling::input")
    FORM_RULE_INPUT: Tuple[str, str] = (By.CSS_SELECTOR, ".rule-input input")
    BTN_ADD_RULE: Tuple[str, str] = (By.CSS_SELECTOR, ".btn-add-rule")
    BTN_REMOVE_RULE: Tuple[str, str] = (By.CSS_SELECTOR, ".btn-remove")
    CATEGORY_CHECKBOXES: Tuple[str, str] = (By.CSS_SELECTOR, ".checkbox-label input[type='checkbox']")
    PRIZE_INPUTS: Tuple[str, str] = (By.CSS_SELECTOR, ".form-row input[type='number']")
    BTN_SUBMIT_CREATE: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-actions .btn.btn--primary")
    BTN_CANCEL_CREATE: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-actions .btn.btn--secondary")

    ADMIN_CHALLENGE_CARDS: Tuple[str, str] = (By.CSS_SELECTOR, ".admin-challenge-card")
    RULES_LIST: Tuple[str, str] = (By.CSS_SELECTOR, ".rule-input")

    # ── Challenges List Page ──
    CHALLENGE_CARDS: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-card")
    CHALLENGE_CARD_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-card__title")
    BADGE_ACTIVE: Tuple[str, str] = (By.CSS_SELECTOR, ".badge--active")
    BADGE_UPCOMING: Tuple[str, str] = (By.CSS_SELECTOR, ".badge--upcoming")
    BADGE_COMPLETED: Tuple[str, str] = (By.CSS_SELECTOR, ".badge--completed")
    ENTER_CHALLENGE_BTN: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-card__cta")

    # ── Challenge Detail Page ──
    DETAIL_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-banner__content h1")
    DETAIL_BADGE: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-banner .badge")
    BTN_CREATE_ENTRY: Tuple[str, str] = (By.CSS_SELECTOR, ".enter-challenge-btn--primary")
    BTN_SUBMIT_EXISTING: Tuple[str, str] = (By.CSS_SELECTOR, ".enter-challenge-btn--secondary")
    CHALLENGE_ACTIONS: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-actions")

    # Leaderboard
    LEADERBOARD: Tuple[str, str] = (By.CSS_SELECTOR, ".challenge-leaderboard")
    SUBMISSION_CARDS: Tuple[str, str] = (By.CSS_SELECTOR, ".submission-card")
    BTN_RATE: Tuple[str, str] = (By.CSS_SELECTOR, ".rate-submission-btn")

    # Rating Modal
    RATING_MODAL: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-modal")
    RATING_MODAL_TITLE: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-modal__header h2")
    RATING_SLIDERS: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-slider")
    RATING_VALUES: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-value")
    TOTAL_SCORE: Tuple[str, str] = (By.CSS_SELECTOR, ".total-score__value")
    FEEDBACK_TEXTAREA: Tuple[str, str] = (By.CSS_SELECTOR, ".feedback-section textarea")
    BTN_SUBMIT_RATING: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-modal__actions .btn.btn--primary")
    BTN_CANCEL_RATING: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-modal__actions .btn.btn--secondary")
    RATING_CLOSE_BTN: Tuple[str, str] = (By.CSS_SELECTOR, ".rating-modal .close-btn")

    # Submit Existing Modal
    COMPONENT_SELECT_GRID: Tuple[str, str] = (By.CSS_SELECTOR, ".component-select-grid")
    COMPONENT_SELECT_CARD: Tuple[str, str] = (By.CSS_SELECTOR, ".component-select-card")
    BTN_MODAL_SUBMIT: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-actions .btn.btn--primary")
    BTN_MODAL_CANCEL: Tuple[str, str] = (By.CSS_SELECTOR, ".modal-actions .btn.btn--secondary")

    # ── Navigation ──
    def open_challenges(self, base_url: str) -> None:
        try:
            self.driver.switch_to.alert.accept()
        except Exception:
            pass
        self.open(f"{base_url}/challenges")
        import time
        time.sleep(3)

    def open_admin_challenges(self, base_url: str) -> None:
        # Dismiss any lingering alert from previous test
        try:
            self.driver.switch_to.alert.accept()
        except Exception:
            pass
        self.open(f"{base_url}/admin/challenges")
        import time
        time.sleep(3)  # Wait for admin page to load and API to return

    def open_challenge_detail(self, base_url: str, challenge_id: str) -> None:
        self.open(f"{base_url}/challenges/{challenge_id}")

    # ── Admin - Create Challenge Form ──
    def click_create_challenge(self) -> None:
        el = self.find(self.BTN_CREATE)
        try:
            el.click()
        except Exception:
            self.driver.execute_script("arguments[0].click();", el)

    def is_modal_visible(self) -> bool:
        return self.is_visible(self.MODAL_CONTENT)

    def fill_title(self, title: str) -> None:
        self.type(self.FORM_TITLE, title)

    def fill_description(self, desc: str) -> None:
        self.type(self.FORM_DESCRIPTION, desc)

    def fill_banner_url(self, url: str) -> None:
        self.type(self.FORM_BANNER_URL, url)

    def _set_react_input_value(self, element, value: str) -> None:
        """Set value on a React controlled input by simulating native input setter."""
        self.driver.execute_script("""
            var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'value'
            ).set;
            nativeInputValueSetter.call(arguments[0], arguments[1]);
            arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
            arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
        """, element, value)

    def fill_start_date(self, date: str) -> None:
        el = self.find(self.FORM_START_DATE)
        self._set_react_input_value(el, date)

    def fill_end_date(self, date: str) -> None:
        el = self.find(self.FORM_END_DATE)
        self._set_react_input_value(el, date)

    def add_rule(self, rule_text: str) -> None:
        """Type text into the last rule input, then click '+ Add Rule' to add a new empty row."""
        import time
        rule_inputs = self.driver.find_elements(*self.FORM_RULE_INPUT)
        if rule_inputs:
            last_input = rule_inputs[-1]
            last_input.clear()
            last_input.send_keys(rule_text)
        el = self.find(self.BTN_ADD_RULE)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", el)
        time.sleep(0.3)
        self.driver.execute_script("arguments[0].click();", el)
        time.sleep(0.5)

    def get_rules_count(self) -> int:
        try:
            elements = self.driver.find_elements(*self.RULES_LIST)
            return len(elements)
        except Exception:
            return 0

    def remove_first_rule(self) -> None:
        self.click(self.BTN_REMOVE_RULE)

    def select_category(self, index: int = 0) -> None:
        checkboxes = self.driver.find_elements(*self.CATEGORY_CHECKBOXES)
        if len(checkboxes) > index:
            self.driver.execute_script("arguments[0].click();", checkboxes[index])

    def get_selected_categories_count(self) -> int:
        checkboxes = self.driver.find_elements(*self.CATEGORY_CHECKBOXES)
        return sum(1 for cb in checkboxes if cb.is_selected())

    def get_prize_values(self) -> List[str]:
        inputs = self.driver.find_elements(*self.PRIZE_INPUTS)
        return [inp.get_attribute("value") or "" for inp in inputs]

    def set_prize(self, index: int, value: str) -> None:
        inputs = self.driver.find_elements(*self.PRIZE_INPUTS)
        if len(inputs) > index:
            inputs[index].clear()
            inputs[index].send_keys(value)

    def submit_create_form(self) -> None:
        el = self.find(self.BTN_SUBMIT_CREATE)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", el)
        import time
        time.sleep(0.5)
        self.driver.execute_script("arguments[0].click();", el)

    def cancel_create_form(self) -> None:
        el = self.find(self.BTN_CANCEL_CREATE)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", el)
        self.driver.execute_script("arguments[0].click();", el)

    def get_title_value(self) -> str:
        return self.find(self.FORM_TITLE).get_attribute("value") or ""

    # ── Challenges List ──
    def get_challenge_cards(self) -> list:
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located(self.CHALLENGE_CARDS)
        )
        return self.driver.find_elements(*self.CHALLENGE_CARDS)

    def has_active_challenges(self) -> bool:
        return self.is_visible(self.BADGE_ACTIVE)

    def has_upcoming_challenges(self) -> bool:
        return self.is_visible(self.BADGE_UPCOMING)

    def get_first_active_challenge_id(self) -> str:
        """Get the ID of the first active challenge via API fetch in browser."""
        result = self.driver.execute_script("""
            const resp = await fetch('http://localhost:3000/challenges');
            const data = await resp.json();
            const active = data.find(c => c.status === 'active');
            return active ? active._id : null;
        """)
        return result or ""

    def get_first_upcoming_challenge_id(self) -> str:
        """Get the ID of the first upcoming challenge via API fetch in browser."""
        result = self.driver.execute_script("""
            const resp = await fetch('http://localhost:3000/challenges');
            const data = await resp.json();
            const upcoming = data.find(c => c.status === 'upcoming');
            return upcoming ? upcoming._id : null;
        """)
        return result or ""

    def navigate_to_active_challenge(self, base_url: str) -> bool:
        """Navigate directly to the first active challenge detail page."""
        challenge_id = self.get_first_active_challenge_id()
        if not challenge_id:
            return False
        self.open(f"{base_url}/challenges/{challenge_id}")
        import time
        time.sleep(3)
        return True

    def navigate_to_upcoming_challenge(self, base_url: str) -> bool:
        """Navigate directly to the first upcoming challenge detail page."""
        challenge_id = self.get_first_upcoming_challenge_id()
        if not challenge_id:
            return False
        self.open(f"{base_url}/challenges/{challenge_id}")
        import time
        time.sleep(3)
        return True

    # ── Challenge Detail ──
    def get_detail_title(self) -> str:
        return self.get_text(self.DETAIL_TITLE)

    def is_create_entry_visible(self) -> bool:
        return self.is_visible(self.BTN_CREATE_ENTRY)

    def is_submit_existing_visible(self) -> bool:
        return self.is_visible(self.BTN_SUBMIT_EXISTING)

    def click_create_entry(self) -> None:
        self.click(self.BTN_CREATE_ENTRY)

    def click_submit_existing(self) -> None:
        self.click(self.BTN_SUBMIT_EXISTING)

    # ── Rating ──
    def click_rate_button(self) -> None:
        self.click(self.BTN_RATE)

    def is_rating_modal_visible(self) -> bool:
        return self.is_visible(self.RATING_MODAL)

    def get_rating_sliders(self) -> list:
        return self.driver.find_elements(*self.RATING_SLIDERS)

    def get_total_score(self) -> str:
        return self.get_text(self.TOTAL_SCORE)

    def set_slider_value(self, slider_element, value: int) -> None:
        self.driver.execute_script(
            "arguments[0].value = arguments[1];"
            "arguments[0].dispatchEvent(new Event('input', {bubbles:true}));"
            "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
            slider_element,
            value,
        )

    def fill_feedback(self, text: str) -> None:
        self.type(self.FEEDBACK_TEXTAREA, text)

    def submit_rating(self) -> None:
        self.click(self.BTN_SUBMIT_RATING)

    # ── Submit Existing Component Modal ──
    def is_component_select_visible(self) -> bool:
        return self.is_visible(self.COMPONENT_SELECT_GRID)

    def select_first_component(self) -> None:
        self.click(self.COMPONENT_SELECT_CARD)

    def is_modal_submit_enabled(self) -> bool:
        btn = self.find(self.BTN_MODAL_SUBMIT)
        return btn.is_enabled()

    def get_alert_text(self, timeout: int = 5) -> str:
        alert = WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
        text = alert.text
        alert.accept()
        return text
