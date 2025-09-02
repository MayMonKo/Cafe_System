from django.db import models

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=50, choices=[
        ('drink', 'Drink'),
        ('food', 'Food'),
        ('dessert', 'Dessert')
    ])

    def __str__(self):
        return f"{self.name} - ${self.price}"

class Order(models.Model):
    customer_name = models.CharField(max_length=100)
    items = models.ManyToManyField(MenuItem)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"
