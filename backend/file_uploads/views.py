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

        if not file or not category:
            return Response({"error": "Missing file or category"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"File Name: {file.name}")
        print(f"File Size: {file.size}")

        file_serializer = UploadedFileSerializer(data={"file": file, "category": category})

        if file_serializer.is_valid():
            file_serializer.save()
            return Response({"message": "File uploaded successfully!"}, status=status.HTTP_201_CREATED)

        print("Serializer Errors:", file_serializer.errors)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
