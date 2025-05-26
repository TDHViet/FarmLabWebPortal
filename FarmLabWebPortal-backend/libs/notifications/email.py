import collections
import logging
import typing
import urllib.error

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

import html_sanitizer

logger = logging.getLogger("django")

EmailFile = collections.namedtuple(
    "EmailFile",
    [
        "filename",
        "content",
        "mimetype",
    ],
)


class EmailNotification:
    """Wrap up of django.core send_mail function.

    It used for sending email with html and plain text content. Also it allows
    to store email-specific data.

    """

    subject = ""
    from_email = ""
    recipient_list = tuple()
    template = ""
    plain_template = ""
    template_context = {}
    files = tuple()
    email_tmpl_context = {}

    def __init__(
        self,
        subject: str = "",
        from_email: str = "",
        recipient_list: typing.Sequence[str] = tuple(),
        template: str = "",
        plain_template: str = "",
        files: typing.Sequence[EmailFile] = tuple(),
        **template_context,
    ) -> None:
        """Initialize EmailNotification.

        Arguments:
            subject(str): Subject of email
            from_email(str): Sender of email
            recipient_list(list, tuple): List of receivers of email
            template(str): Path to email html template
            plain_template(str): Path to email plain/text template
            files: typing.Sequence[EmailFile]: list file's attachments
            template_context: Context of email html template

        """
        self.subject = subject or self.subject
        self.from_email = from_email or self.from_email
        self.recipient_list = recipient_list or self.recipient_list
        self.template = template or self.template
        self.plain_template = plain_template or self.plain_template
        self.files = files
        self.template_context = template_context or self.template_context

    def get_subject(self) -> str:
        """Get email's subject."""
        return self.subject

    def get_formatted_subject(self) -> str:
        """Get email's formatted subject.

        Can be used to add common text to email subjects.

        """
        return self.get_subject()

    def get_from_email(self) -> str:
        """Get email `sender`."""
        return self.from_email

    def get_recipient_list(self) -> typing.Sequence[str]:
        """Get email's recipients."""
        return self.recipient_list

    def get_template(self) -> str:
        """Get email's template."""
        return self.template

    def get_plain_template(self) -> str:
        """Get email's plain template."""
        return self.plain_template

    def get_template_context(self) -> dict[str, typing.Any]:
        """Get email's template context."""
        return self.template_context

    def get_files(self) -> typing.Sequence[EmailFile]:
        """Get email's files attachments."""
        return self.files

    def prepare_html_text(self) -> str:
        """Prepare html message for email."""
        html_message = render_to_string(
            self.get_template(),
            self.get_template_context(),
        )
        return html_message

    def prepare_plain_text(self, html_message: str) -> str:
        """Prepare plain message for email.

        Fill `plain_template` with context or remove tags of filled html
        template. Used html-sanitizer to save links.

        """
        if message_template := self.get_plain_template():
            plain_message = render_to_string(
                message_template,
                self.get_template_context(),
            )
            return plain_message

        sanitizer = html_sanitizer.Sanitizer()
        plain_message = sanitizer.sanitize(html_message)
        return plain_message

    def prepare_mail_text(self) -> tuple[str, str]:
        """Prepare html content of email(plain text and email)."""
        html_message = self.prepare_html_text()
        plain_text_content = self.prepare_plain_text(html_message)
        return html_message, plain_text_content

    def prepare_mail_args(self) -> dict[str, typing.Any]:
        """Prepare email arguments before sending."""
        subject = self.get_formatted_subject()
        html_content, plain_text_content = self.prepare_mail_text()
        from_email = self.get_from_email()
        recipient_list = self.get_recipient_list()
        files = self.get_files()

        return {
            "subject": subject,
            "body": plain_text_content,
            "from_email": from_email,
            "to": recipient_list,
            "html_message": html_content,
            "files": files,
        }

    def send(self) -> bool:
        """Send email.

        Returns
            True: if it succeeded
            False: if it failed

        """
        email_args = self.prepare_mail_args()
        html_message = email_args.pop("html_message")
        files = email_args.pop("files")

        mail = EmailMultiAlternatives(**email_args)
        mail.attach_alternative(html_message, "text/html")

        # Attach files
        for file in files:
            mail.attach(
                filename=file.filename,
                content=file.content,
                mimetype=file.mimetype,
            )

        # Send email
        try:
            mail.send()
            self.on_email_send_succeed()
            return True
        except urllib.error.HTTPError as error:  # pragma: no cover
            logger.exception(
                f"Error while sending email to {email_args['to']}",
            )
            self.on_email_send_failed(error)
            return False

    def on_email_send_succeed(self) -> None:
        """Perform action, when email sending succeed."""

    def on_email_send_failed(self, error: urllib.error.HTTPError) -> None:
        """Perform action, when email sending failed."""


class DefaultEmailNotification(EmailNotification):
    """Used to send mails from app default address."""

    from_email = settings.DEFAULT_FROM_EMAIL

    def get_formatted_subject(self) -> str:
        """Add app label to subject."""
        return f"{settings.APP_LABEL} - {self.get_subject()}"
