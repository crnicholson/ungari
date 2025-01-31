# Ungari

<img src="https://github.com/crnicholson/ungari/blob/master/media/hero.png" alt="Hero image" width="300"/> 

An [app](ungari.vercel.app) that connects problems to thinkers. 

## How to use

* Start by selecting your skills and what you want to work on, or by submitting a problem you have that needs solving.
* Get matched with someone whose problem matches your skillset, or vice versa! This could be anyone from a researcher to an entrepreneur.
* Collaborate and work together to solve the problem - and ship a meaningful project.

## Features

* Auth0 based signup and login, allowing you to sign up with Google.
* 100% open source design.
* Fully featured settings and match page. 
* Complete and useful error handling. 
* Custom React components to allow for scaling. 

## Tech stack

The backend is programmed in Python, while the frontend is made in Next.js and deployed with Vercel. I am hosting the backend on Hack Club Nest and using port forwarding to make the API available. To store data, I am running a MongoDB instance in Docker container also on Nest. For authentication, I am using Auth0. 

## Connection algorithim

The algorithim to connect users with each other takes into account the number of common skills and common themes along with the prefered time frame. It is still being refined to give better results. 

## Images!

<img src="https://github.com/crnicholson/ungari/blob/master/media/settings.png" alt="Settings page" width="500"/> 
*Settings*

<img src="https://github.com/crnicholson/ungari/blob/master/media/match.png" alt="Match page" width="500"/> 
*Match*

## License

Everything is licensed under the [GNU GPL v3 license](https://choosealicense.com/licenses/gpl-3.0/). 