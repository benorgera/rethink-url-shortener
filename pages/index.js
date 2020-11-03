
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
 
import css from './w3.css';

// trusted npm dependency, 24mil downloads per week
// could probably be used in production
const normalizeUrl = require('normalize-url');
const url = require('url');

const minShortUrlLen = 1;

// from stackoverflow, make random string over alphabet
const alphabet     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const alphabetSize = alphabet.length;
function makeid(length) {
   var result           = '';
   for (var i = 0; i < length; i++) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabetSize));
   }
   return result;
}

const logBase = (x, y) => Math.log(y) / Math.log(x);

function Shortener() {

	const [uidMap] = useState(new Map());
	const [urlMap] = useState(new Map());

	const [urlToShorten, setUrlToShorten] = useState('');
	const [urlToFollow, setUrlToFollow] = useState('');

	const handleChangeShorten = e => setUrlToShorten(event.target.value);
	const handleChangeFollow = e => setUrlToFollow(event.target.value);

	const toUserUrl = uid => 'foo.com/' + uid;

	const shortenUrl = e => {
		e.preventDefault();
		const normalized = normalizeUrl(urlToShorten),
		      lookup = urlMap.get(normalized);

		if (lookup !== undefined) 
			alert(`URL "${urlToShorten}" was already shortened to "${toUserUrl(lookup)}"`);
		else {
			// need n >= log_(alphabetSize) (2 * # of urls redirecting)
			// this ensures constant runtime of loop with high probability
			const enoughUidChars = Math.ceil(logBase(alphabetSize, 2 * uidMap.size || 2)),
			      uidLen = enoughUidChars < minShortUrlLen ? minShortUrlLen : enoughUidChars;

			var uid = undefined;
			// loop runs 2 times in expectation, O(1) time with high probability
			do {
				uid = makeid(uidLen);
			} while (uidMap.has(uid));

			const userUrl = toUserUrl(uid);
			urlMap.set(normalized, uid);
			uidMap.set(uid, normalized);

			alert(`"${userUrl}" now is shortened version of "${urlToShorten}"`);
		}
	};

	const redirect = e => {
		e.preventDefault();

		var lookup;
		try {
			// this lookup is agnostic to equivalent urls
			// it also allows just supplying UID (ie. gQ instead of foo.com/gQ)
			const normalized = normalizeUrl(urlToFollow.includes('/') ? urlToFollow : 'foo.com/' + urlToFollow),
		          uid = normalized && (new URL(normalized)).pathname.replace('/', '');
		    
		    lookup = uidMap.get(uid);
		} catch (err) {
			return alert(`Invalid URL "${urlToFollow}"`);
		}

		if (lookup === undefined) {
			alert(`URL "${urlToFollow}" is not a known shortened url`);
		} else {
			const newWindow = window.open(lookup, '_blank', 'noopener,noreferrer');
            if (newWindow)
            	newWindow.opener = null;
		}
	};

	return (
		<div>
		<div className={css['w3-container'] + ' ' + css['w3-blue']}>
		<h2>URL Shortener</h2>
		</div>
		<form className={css['w3-container']}>
           <label>Shorten URL:
           <input className={css['w3-input']} type="text" onChange={handleChangeShorten} value={urlToShorten}/>
           </label>
           <button className={css['w3-button'] + ' ' + css['w3-blue']} onClick={shortenUrl}>Shorten</button>

           <br/><br/>
           <label>Follow Shortened URL:</label>
           <input className={css['w3-input']} type="text" onChange={handleChangeFollow} value={urlToFollow}/>
           <button className={css['w3-button'] + ' ' + css['w3-blue']} onClick={redirect}>Redirect</button>
        </form>
        </div>
    );
}
 
const App = () => (<Shortener Shortener/>);

export default App;