let leftSide = true;

// const text = Array(1e3)
// 	.fill(0)
// 	.map((_, i) => i)
// .join(" ");

const text = `I wasn't starting yet, I didn't even think you were listening
I wasn't ready at all to say anything about anything interesting
It's a thing you have, you just don't know that you do it
You wait around in a conversation while I get in and start stumbling through it

I was so distracted then
I didn't have it straight in my head
I didn't have my face on yet
Or the role or the feel of where I was going with it all
I was suffering more than I let on
The tropic morning news was on
There's nothing stopping me now
From saying all the painful parts out loud

Got to my feet feeling that I'd let you down
Wanted to say it slow and perfect but it all somehow got switched around
Something went off on its own, my dumb automatic chit chat
It's not what I meant to say at all, there's no way you can attach me to that

Got up to seize the day 
With my head in my hands feeling strange
When all my thinking got mangled
And I caught myself talking myself off the ceiling
I was suffering more than I let on
The tropic morning news was on
There's nothing stopping me now
From saying all the painful parts out loud

Oh, where are all the moments we'd have?
Oh, where's the brain we shared?
Something somehow has you rapidly improving
Oh, what happened to the wavelength we were on?
Oh, where's the gravity gone?
Something somehow has you rapidly improving

You found the ache in my argument
You couldn't wait to get out of it
You found the slush in my sentiment
You made it sound so intelligent

You can stop and start an athlete's heart
How do I feel about it?
I would love to have nothing to do with it
I would like to move on and be through with it

I'll be over here lying near the ocean making ocean sounds
Let me know if you can come over and work the controls for a while

I was so distracted then
I didn't have it straight in my head
I didn't have my face on yet
Or the role or the feel of where I was going with it all
I was suffering more than I let on
The tropic morning news was on
There's nothing stopping me now
From saying all the painful parts out loud

Oh, where are all the moments we'd have?
Oh, where's the brain we shared?
Something somehow has you rapidly improving
Oh, what happened to the wavelength we were on?
Oh, where's the gravity gone?
Something somehow has you rapidly improving`
	.trim()
	.split("\n")
	.join(" ");

async function layoutWords(content = document.querySelector(".content")) {
	let lastWord = "";
	leftSide = true;
	const words = text
		.replace(/(tropic|morning|news)/gi, "<strong>$1</strong>")
		.split(" ");

	// Establish height of paragraph with one word as content to get the base height
	content.querySelectorAll(".left-half, .right-half").forEach((side) => {
		side.querySelectorAll("p").forEach((el) => el.remove());
		side.innerHTML += "<p>Hi!</p>";
	});

	const baseHeight = content.querySelector("p").getBoundingClientRect().height;
	content.querySelectorAll("p").forEach((el) => (el.innerHTML = ""));

	// await new Promise((resolve) => requestAnimationFrame(resolve, 0));
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const wrapper = content.querySelector(
			leftSide ? ".left-half" : ".right-half"
		);

		const lastP = wrapper.children[wrapper.children.length - 1];

		lastP.innerHTML += ` ${word}`;
		if (lastP.getBoundingClientRect().height > baseHeight && i !== lastWord) {
			leftSide = !leftSide;

			lastP.innerHTML = lastP.innerHTML.split(" ").slice(0, -1).join(" ");

			wrapper.innerHTML += "<p></p>";

			lastWord = Number(i);

			i--;
		}
	}
}

function attemptSize(size) {
	const el = document.importNode(document.querySelector(".content"), true);
	document.body.appendChild(el);
	el.setAttribute("style", `--font-size: ${size}px`);
	layoutWords(el);

	const lastP = Array.from(el.querySelectorAll("p")).pop();

	const lastPRect = lastP.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();
	const offset =
		lastPRect.top + lastPRect.height - (elRect.top + elRect.height);

	el.remove();

	return offset;
}

function findBestSize() {
	let size = 2;
	for (let i = 0; i < 10; i++) {
		const a = attemptSize(size);
		const diff = Math.abs(size - (size - a / 60));
		console.log(size - a / 60);
		if (diff < 0.01) i = 10; // Skip
		size -= a / 60;
	}
	return size;
}

function main() {
	document.querySelector(".content").classList.remove("text-visible");

	requestAnimationFrame(() => {
		const bestSize = findBestSize();
		document
			.querySelector(".content")
			.setAttribute("style", `--font-size: ${bestSize}px`);

		layoutWords();

		document.querySelector(".content").classList.add("text-visible");
	});
}

window.addEventListener("load", async () => {
	layoutWords();
	setTimeout(() => {
		main();
	}, 100);

	let resizeDebounce;
	window.addEventListener("resize", () => {
		if (resizeDebounce) clearTimeout(resizeDebounce);
		resizeDebounce = setTimeout(main, 300);
	});
});
