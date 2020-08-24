# Homebrew Taplist

This repo contains a demo of integrating keg-levels into your own digital-taplist. There are three parts to integrate real-time keg-levels into your digital-taplist. First, you need a way to measure the keg-levels using a flow-meter or a weight sensor (e.g., I use a Kegtron device). You also need a way, e.g., an Android app, to read data from these sensors. Second, you need a backend server to which data can be pushed (e.g., I use a combination of Google Sheets and App Script to host the backend).
And third, you need a way to pull data from the backend server and display it on the frontend website (e.g., I use jQuery to pull data from backend and CSS to create graphics displaying keglevel).

For the first part, I have built an Android app to read data from Kegtron and periodically sync it with the cloud.
If you own a Kegtron device, you can checkout the companion app here:

https://github.com/sharathcshekhar/kegtron-cloud.

In this repo, "webapp" folder has the javascript that can be hosted in Google App script which can be your backend and "site" shows an example of pulling data from the backend and integrating it as a nice graphic for your digital-taplist.

You can checkout https://sites.google.com/view/sharath-taplist/home to see how I have created a simple taplist with these techniques.
