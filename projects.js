

// DEFINE GLOBAL VARIABLES

function makeSectionsObj(inputArray) {
	/**
	- create object divided by section types from csv data array
	
	inputArray = [
		{
			section: string,
			title: string,
			description: string,
			url: string,
			image_rel_path: string
		},
		...
	]

	outputObj = {
		sectionA: [
			{
				title: string, 
				description: string, 
				url: string,
				image_rel_path: string,
			}] 
		sectionB: [{...}, ...]
	}

	**/	 

	var outputObj = {};

	console.log("dataArray input:", inputArray);

	for (var i=0; i<inputArray.length; i++) {
		const row = inputArray[i];
		const s = row.section.trim();
		const section = s.replace(/\s+/g, '-').toLowerCase();	// section string processing: replace all whitespaces with hyphens, and lowercase

		if (outputObj.hasOwnProperty(section) === false) {
			// if section not yet in outputObj, initialize with section as key and row object in linear array as value
			console.log('makeSectionsObj: section not in outputObj:', section);
			outputObj[section] = [row];
		} else {
			// else, add particular row as an object to linear array for particular section
			outputObj[section].push(row); 
		}

	}

	console.log("outputObj:", JSON.stringify(outputObj));

	return(outputObj);


}

function renderGitHubButton(github) {
	if (github.length > 0) {
		return(`<a href="${ github }" class="btn btn-dark col-md mt-2">GitHub code</a>`)
	} else {
		return("")
	}
}

function renderCards(sectionsObj) {

	for (var section in sectionsObj) {
		if (sectionsObj.hasOwnProperty(section)) {
		
			const sectionDisplay = section.replace(/-/g, ' ').toLowerCase();	// section string processing: for display, replace all hyphens with whitespaces

			console.log("s:", sectionDisplay);
			console.log("section:", section);

			const sectionArray = sectionsObj[section];

			const sectionHTMLString = `
				<div class="section-container container-fluid" id="${section}-section">
					<div class="row d-flex justify-content-center">
						<h2 class="section-heading">
							${sectionDisplay}
						</h2>
					</div>
				<div>
			`;

			// bind section element to root element			
			$('#root').append(sectionHTMLString);

			// define how many cards in a row for this particular section
			const cardsInRow = 2;
			var rowsNum = Math.ceil(sectionArray.length / cardsInRow);	// rounds up to nearest row
			const colsNum = (12 / cardsInRow) - 1	// determines size of Bootstrap Grid columns per card, minus constant to account for margin spacing
			// console.log(`${section} num of rows:`, rowsNum)

			// generate number of card row elements
			for (var i=1; i<rowsNum+1; i++) {
				$(`#${section}-section`).append(`<div class="row card-row justify-content-md-center" id="${section}-row-${i}"></div>`);
			}

			// process each row of portfolio attributes and values from csv in particular section
			var rowID = 1;
			var rowCountdown = cardsInRow;
			for (var i=0; i<sectionArray.length; i++) {

				// define variables for attributes of each project from csv
				const projectObj = sectionArray[i];
				const title = projectObj.title.trim();
				const description = projectObj.description.trim();
				const u = projectObj.url.trim();
				const github = projectObj.github.trim();
				const githubButton = renderGitHubButton(github);
				const imagePath = "./static" + "/portfolio-images" + "/" + projectObj['image_name'].trim();


				// put attributes in HTML string for card
				const cardHTMLString = `
					<div class="col-md-${ colsNum } card">
						
						<div class="card-img-container">
							<a href="${ u }" alt="...">
								<img src="${ imagePath }" class="card-img-top" alt="..." />
							</a>
						</div>

						<div class="card-body">
							
							<a href="${ u }" alt="">
								<h5 class="card-title">
									<p>
										${ title }
									</p>
								</h5>
							</a>

							<p class="card-text">
								${ description }
							</p>

							<div class="row">
								<a href="${ u }" class="btn btn-primary col-md mr-md-2 mt-2">View project</a>
								${ githubButton }
							</div>

						</div>

					</div>
					`


				$(`#${section}-row-${rowID}`).append(cardHTMLString);
				console.log("i:", i);
				console.log("rowCountdown:", rowCountdown);
				console.log("rowID:", rowID);
				console.log("---");
	
				if (rowCountdown > 1) {
					// row count down
					rowCountdown = rowCountdown - 1;

				} else {
					// reset rowCountdown since num of cardsInRow is reached

					// increase rowID to next row
					rowID = rowID + 1;

					// reset rowCountdown
					rowCountdown = cardsInRow;
				}

			}
			

		}
	}
}

function main() {
	
	// alert("HELLO");

	d3.csv("projects.csv", function(error, dataArray) {
		if (error) {
			throw Error("data file could not be loaded");
			alert("Sorry this page can't be loaded at this time.");
		}

		//console.log("dataArray:", dataArray);
		//console.log("type of dataArray:", typeof dataArray);


		const sectionsObj = makeSectionsObj(dataArray);

		console.log("sections object in d3:", sectionsObj)

		renderCards(sectionsObj);

	})


};

$(document).ready(main());