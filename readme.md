# Usage

To install and launch run: `npm i && npm run dev`, then open `localhost:3000`

The UI provides an input field where the user can enter URLs they seek to shorten, and a redirect field for following these shortened URLs. The app is agnostic to equivalent URLs thanks to the `normalize-url` npm package, and will treat these as the same. Hence it won't allow you to shorten `google.com` and `http://google.com` in sequence, reporting that this URL already maps somewhere.

# Analysis

The algorithm for generating UIDs for the URLs is the coolest part of this app. It enables shortened URLs to be as short as possible, without using a scheme like enumerating the UIDs in order (a scheme vulnerable to attacks). And it runs in constant time (with high probability).

It generates a random UID with length proportional to the logarithm of twice the number of random UIDs generated thus far. This ensures the likelihood of a collision in UIDs is at most 1/2, so the loop which generates UIDs until finding a fresh one takes 2 steps on average, and more than `n` steps with probability exponentially small in `n`.

It is worth noting the set of UIDs used is stored in memory, and productionizing such a scheme would require migrating this to a database.