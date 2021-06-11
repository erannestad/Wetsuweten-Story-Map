function testExpandMediaContainer(clickedElement){
	if (clickedElement.classList.contains('active')){
		console.log('deactivate')
		clickedElement.classList.remove('active')
		
		var allSections = document.querySelectorAll('section');
		allSections.forEach(function(section) {
		    section.classList.remove('expand-left');
		});

		map.invalidateSize();
		// clickedElement.scrollIntoView(); // Boolean parameter


	} else {
		console.log('activate')
		clickedElement.classList.add('active');

		var allSections = document.querySelectorAll('section');
		allSections.forEach(function(section) {
		    section.classList.add('expand-left');
		});

		map.invalidateSize();
		clickedElement.scrollIntoView() // Boolean parameter


	}
}

