from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import UploadedFile
from .serializers import UploadedFileSerializer

class UploadedFileView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        print("Received Request Data:", request.data)
        print("Received File:", request.FILES)

        file = request.FILES.get("file")
        category = request.data.get("category")

        if not file:
            return Response({"error": "No file received"}, status=status.HTTP_400_BAD_REQUEST)

        if not category:
            return Response({"error": "No category provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Check file size manually
        if file.size > 5 * 1024 * 1024:  # 5MB limit
            return Response({"error": "File size exceeds 5MB limit"}, status=status.HTTP_400_BAD_REQUEST)

        # Check file extension
        allowed_extensions = ["pdf", "jpg", "png", "jpeg", "docx"]
        if not file.name.lower().endswith(tuple(allowed_extensions)):
            return Response({"error": "Invalid file type"}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with file serialization
        file_serializer = UploadedFileSerializer(data={"file": file, "category": category})

        if file_serializer.is_valid():
            file_serializer.save()

            return Response({"message": "File uploaded successfully!"}, status=status.HTTP_201_CREATED)

        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
