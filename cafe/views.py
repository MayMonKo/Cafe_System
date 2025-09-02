from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to the Café ☕</h1><p>Your app is working!</p>")
