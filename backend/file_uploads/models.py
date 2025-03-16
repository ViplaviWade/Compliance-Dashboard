from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

def validate_file_size(file):
    max_size = 5 * 1024 * 1024  # 5MB
    if file.size > max_size:
        raise ValidationError("File size must be less than 5MB.")
    
class UploadedFile(models.Model):
    file = models.FileField(
        upload_to="uploads/",
        validators=[
            FileExtensionValidator(allowed_extensions=["pdf", "jpg", "png", "docx", "jpeg"]),
            validate_file_size  # Custom validator
        ]
    )
    category = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name