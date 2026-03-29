from datetime import datetime

import pytest

from pages.comment_page import CommentPage


@pytest.mark.comments
class TestCommentsAdditional:
    def test_TC_COMMENT_002_filter_by_element(self, logged_in_driver, additional_test_data, auth_data, seeded_comment_scope_components):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_002_FilterByElement"]
        component_a = seeded_comment_scope_components["component_a"]
        page.open(f"{auth_data['base_url']}/element/{component_a['_id']}")
        comments_text = page.get_comments_text()
        assert data["component_a"]["comment"] in comments_text
        assert data["component_b"]["comment"] not in comments_text

    def test_TC_COMMENT_004_guest_prompt_visible(self, driver, auth_data, seeded_public_component):
        page = CommentPage(driver)
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        assert page.is_login_prompt_visible()
        assert not page.is_visible(page.COMMENT_INPUT)

    def test_TC_COMMENT_006_reply_form_closes_after_submit(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_006_ReplyFormClose"]
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        seed_comment = f"reply seed {datetime.now().isoformat()}"
        page.add_comment(seed_comment)
        assert page.wait_until_comment_visible(seed_comment)
        page.reply_first_comment(data["reply_content"])
        assert page.wait_until_comment_visible(data["reply_content"])
        assert page.is_not_visible(page.REPLY_INPUT, timeout=5)

    def test_TC_COMMENT_007_author_and_time_displayed(self, logged_in_driver, auth_data, seeded_public_component, current_user_profile):
        page = CommentPage(logged_in_driver)
        content = f"metadata check {datetime.now().isoformat()}"
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.add_comment(content)
        assert page.wait_until_comment_visible(content)
        assert page.get_first_root_comment_author() == current_user_profile["userName"]
        assert page.get_first_root_comment_date() != ""

    def test_TC_COMMENT_008_newest_comment_first(self, logged_in_driver, additional_test_data, auth_data, seeded_public_component):
        page = CommentPage(logged_in_driver)
        data = additional_test_data["comments"]["TC_COMMENT_008_Order"]
        first_content = f"{data['first_prefix']} {datetime.now().strftime('%H%M%S')}"
        second_content = f"{data['second_prefix']} {datetime.now().strftime('%H%M%S%f')}"
        page.open(f"{auth_data['base_url']}/element/{seeded_public_component['_id']}")
        page.add_comment(first_content)
        assert page.wait_until_comment_visible(first_content)
        page.add_comment(second_content)
        assert page.wait_until_comment_visible(second_content)
        root_texts = page.get_root_comment_texts()
        assert root_texts
        assert root_texts[0] == second_content
