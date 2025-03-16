from django.contrib import admin
from django.urls import path
from file_uploads.views import UploadedFileView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/upload/", UploadedFileView.as_view(), name="file-upload"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
