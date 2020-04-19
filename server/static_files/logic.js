const mainBlock = document.getElementsByClassName('main')[0];
const input = document.getElementsByClassName('data__input')[0];
const output = document.getElementsByClassName('data__output')[0];
const button = document.getElementsByClassName('data__button')[0];
const qrImage = document.getElementsByClassName('data__img')[0];

mainBlock.style.height = screen.height + 'px';
output.style.visibility = 'hidden';
qrImage.style.visibility = 'hidden';


let link = '';

const validateInput = function(linkToCheck) {
	if (linkToCheck.includes('https://')) {
		try {
			return Boolean(new URL(linkToCheck));
		} catch (e) {
			return false;
		}
		return true;
	} else {
		link = 'https://' + link;
		return validateInput(link);
	}
	
}


button.addEventListener('click', () => {
	link = input.value;
	if (validateInput(link)) {
		fetch('/request', {
			method: 'POST',
			headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
			body: JSON.stringify({long_link: link})
		})
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			output.style.visibility = 'initial';
			if (data.status === 200 || data.status === 201) {
				qrImage.style.visibility = 'initial';
				output.value = data.link.replace(/"/g, "");
				qrImage.src = data.qrCode;
			} else {
				output.value = "Oops, something went wrong";
			}
		});
	} else {
		output.style.visibility = 'initial';
		output.value = 'Your link is incorrect. Try another link';
	}
})

