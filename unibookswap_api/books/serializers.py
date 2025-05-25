from rest_framework import serializers
from .models import Book
from users.models import User

class BookSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')

    class Meta:
        model = Book
        fields = ['id', 'title', 'isbn', 'course', 'price', 'exchange_option', 'status', 'user_id','cover_image', 'quantity']
        read_only_fields = ['id','user_id']
        extra_kwargs = {
                'cover_image':{'required':False}
                }

    def update(self, instance, validated_data):
        print('This is validated data:',validated_data)

        instance.user = validated_data.get('user', instance.user)
        instance.status = validated_data.get('status', instance.status)
        instance.exchange_option = validated_data.get('exchange_option', instance.exchange_option)
        instance.price = validated_data.get('price', instance.price)
        instance.course = validated_data.get('course', instance.course)
        instance.isbn = validated_data.get('isbn', instance.isbn)
        instance.title = validated_data.get('title', instance.title)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.cover_image = validated_data.get('cover_image', instance.cover_image)
        print('This is an updated instance: ', instance.title)
        instance.save() # model save called from here. 
        print('This is a saved updated instance:', instance.title)
        return instance

    def create(self, validated_data):
        # If you want to set the user automatically based on the request:
        validated_data['user'] = self.context['request'].user
        return Book.objects.create(**validated_data)

