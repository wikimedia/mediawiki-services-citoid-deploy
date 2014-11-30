{
	"translatorID": "e4660e05-a935-43ec-8eec-df0347362e4c",
	"label": "ERIC",
	"creator": "Sebastian Karcher",
	"target": "^https?://(?:www\\.)?eric\\.ed\\.gov/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2014-09-26 19:30:32"
}

/*
	Translator
   Copyright (C) 2013 Sebastian Karcher

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function detectWeb(doc,url) {
	var xpath='//meta[@name="citation_journal_title"]';
	var type = ZU.xpathText(doc, '//meta[@name="source"]/@content');	
	if (ZU.xpath(doc, xpath).length > 0) {
		if (type && type.indexOf("Non-Journal")!=-1) return "book"
		else return "journalArticle";
	}
			
	else if (getMultiples(doc).length>0) return "multiple";
	return false;
}

function getMultiples(doc) {
	return ZU.xpath(doc, '//div[@class="r_t"]/a[contains(@href, "id=")]');
}

 
function doWeb(doc,url) {
	if (detectWeb(doc, url) == "multiple") {
		var hits = {};
		var urls = [];
		var results = getMultiples(doc)
		var link;
		for (var i in results) {
			
			hits[results[i].href] = results[i].textContent.trim();
		}
		Z.selectItems(hits, function(items) {
			if (items == null) return true;
			for (var j in items) {
				urls.push(j);
			}
		ZU.processDocuments(urls, doWeb);
		});
	} else {
		var abstract = ZU.xpathText(doc, '//div[@class="abstract"]').replace(/^\|/, "");
		//Z.debug(abstract)
		var type = ZU.xpathText(doc, '//meta[@name="source"]/@content');
		// We call the Embedded Metadata translator to do the actual work
		var translator = Zotero.loadTranslator('web');
		//use Embedded Metadata
		translator.setTranslator("951c027d-74ac-47d4-a107-9c3069ab7b48");
		translator.setDocument(doc);
		translator.setHandler('itemDone', function(obj, item) {
			item.abstractNote = abstract;
			//the metadata isn't good enough to properly distinguish item types. Anything that's non journal we treat as a book
			if (type && type.indexOf("Non-Journal")!=-1) item.itemType = "book";
			item.title = item.title.replace(/.\s*$/, "");
			if (item.ISSN){ 
				var ISSN = item.ISSN.match(/[0-9Xx]{4}\-[0-9Xx]{4}/);
				if (ISSN) item.ISSN = ISSN[0]
			}
			if (item.ISBN) item.ISBN = ZU.cleanISBN(item.ISBN);
			if (item.publisher) item.publisher = item.publisher.replace(/\..+/, "");
			
			// Only include URL if full text is hosted on ERIC
			if (!ZU.xpath(doc, '//div[@id="r_colR"]//img[@alt="PDF on ERIC"]').length) {
				delete item.url;
			}
			
			item.libraryCatalog = "ERIC";
			item.complete();
		});
		translator.translate();
	}
}/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://eric.ed.gov/?id=EJ956651",
		"items": [
			{
				"itemType": "journalArticle",
				"title": "Collaborating with Parents to Establish Behavioral Goals in Child-Centered Play Therapy",
				"creators": [
					{
						"firstName": "Phyllis B.",
						"lastName": "Post",
						"creatorType": "author"
					},
					{
						"firstName": "Peggy L.",
						"lastName": "Ceballos",
						"creatorType": "author"
					},
					{
						"firstName": "Saundra L.",
						"lastName": "Penn",
						"creatorType": "author"
					}
				],
				"date": "2012/01/00",
				"ISSN": "1066-4807",
				"abstractNote": "The purpose of this article is to provide specific guidelines for child-centered play therapists to set behavioral outcome goals to effectively work with families and to meet the demands for accountability in the managed care environment. The child-centered play therapy orientation is the most widely practiced approach among play therapists who identify a specific theoretical orientation. While information about setting broad objectives is addressed using this approach to therapy, explicit guidelines for setting behavioral goals, while maintaining the integrity of the child-centered theoretical orientation, are needed. The guidelines are presented in three phases of parent consultation: (a) the initial engagement with parents, (b) the ongoing parent consultations, and (c) the termination phase. In keeping with the child-centered approach, the authors propose to work with parents from a person-centered orientation and seek to appreciate how cultural influences relate to parents' concerns and goals for their children. A case example is provided to demonstrate how child-centered play therapists can accomplish the aforementioned goals.",
				"accessDate": "CURRENT_TIMESTAMP",
				"issue": "1",
				"language": "en",
				"libraryCatalog": "ERIC",
				"pages": "51-57",
				"publicationTitle": "Family Journal: Counseling and Therapy for Couples and Families",
				"publisher": "SAGE Publications",
				"volume": "20",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [
					"Cooperative Planning",
					"Counseling Techniques",
					"Counselor Role",
					"Cultural Influences",
					"Cultural Relevance",
					"Guidelines",
					"Interpersonal Relationship",
					"Parent Participation",
					"Play Therapy",
					"Therapy"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://eric.ed.gov/?q=(prekindergarten+OR+kindergarten)+AND+literacy",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "http://eric.ed.gov/?q=(prekindergarten+OR+kindergarten)+AND+literacy&ff1=pubBooks&id=ED509979",
		"items": [
			{
				"itemType": "book",
				"title": "The Building Blocks of Preschool Success",
				"creators": [
					{
						"firstName": "Katherine A.",
						"lastName": "Beauchat",
						"creatorType": "author"
					},
					{
						"firstName": "Katrin L.",
						"lastName": "Blamey",
						"creatorType": "author"
					},
					{
						"firstName": "Sharon",
						"lastName": "Walpole",
						"creatorType": "author"
					}
				],
				"date": "2010/06/00",
				"ISBN": "9781606236949",
				"abstractNote": "Written expressly for preschool teachers, this engaging book explains the \"whats,\" \"whys,\" and \"how-tos\" of implementing best practices for instruction in the preschool classroom. The authors show how to target key areas of language and literacy development across the entire school day, including whole-group and small-group activities, center time, transitions, and outdoor play. Detailed examples in every chapter illustrate what effective instruction and assessment look like in three distinct settings: a school-based pre-kindergarten, a Head Start center with many English language learners, and a private suburban preschool. Helpful book lists, charts, and planning tools are featured, including reproducible materials. Contents include: (1) The Realities of Preschool; (2) A Focus on Oral Language and Vocabulary Development; (3) Comprehension; (4) Phonological Awareness; (5) Print and Alphabet Awareness; (6) Emergent Writing; (7) Tracking Children's Progress: The Role of Assessment in Preschool Classrooms; and (8) Making It Work for Adults and Children.",
				"accessDate": "CURRENT_TIMESTAMP",
				"language": "en",
				"libraryCatalog": "ERIC",
				"publicationTitle": "Guilford Publications",
				"publisher": "Guilford Press",
				"attachments": [
					{
						"title": "Snapshot"
					}
				],
				"tags": [
					"Alphabets",
					"Best Practices",
					"Classroom Environment",
					"Disadvantaged Youth",
					"Educational Assessment",
					"Emergent Literacy",
					"English (Second Language)",
					"Group Activities",
					"Instructional Materials",
					"Language Skills",
					"Oral Language",
					"Phonological Awareness",
					"Play",
					"Preschool Children",
					"Preschool Teachers",
					"Reading Instruction",
					"Reprography",
					"Second Language Learning",
					"Suburban Schools",
					"Vocabulary Development",
					"Writing Instruction"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://eric.ed.gov/?id=EJ906692",
		"items": [
			{
				"itemType": "journalArticle",
				"title": "Determining Faculty Needs for Delivering Accessible Electronically Delivered Instruction in Higher Education",
				"creators": [
					{
						"firstName": "Marsha A.",
						"lastName": "Gladhart",
						"creatorType": "author"
					}
				],
				"date": "2010/00/00",
				"abstractNote": "The purpose of this study was to determine if a need exists for faculty training to improve accommodation for students with disabilities enrolled in electronically delivered courses at a statewide university system. An online survey was used to determine if instructors had students who had been identified as needing accommodation in their online courses, to identify which tools instructors used in electronically delivered instruction, and to determine how familiar the instructors were with strategies for accommodating students with disabilities in their courses. Over half the respondents reported identifying students in their classes with disabilities either by an official notice or through other means of identification. The respondents identified a variety of electronic delivery tools used to provide instruction in distance courses. A low percentage of the faculty surveyed reported they were aware of strategies to improve accessibility in their electronically delivered courses. (Contains 6 tables.)",
				"issue": "3",
				"language": "en",
				"libraryCatalog": "ERIC",
				"pages": "185-196",
				"publicationTitle": "Journal of Postsecondary Education and Disability",
				"url": "http://eric.ed.gov/?id=EJ906692",
				"volume": "22",
				"attachments": [
					{
						"title": "Full Text PDF",
						"mimeType": "application/pdf"
					},
					{
						"title": "Snapshot"
					}
				],
				"tags": [
					"Academic Accommodations (Disabilities)",
					"College Faculty",
					"Delivery Systems",
					"Disabilities",
					"Disability Identification",
					"Educational Needs",
					"Educational Practices",
					"Educational Strategies",
					"Electronic Learning",
					"Familiarity",
					"Mail Surveys",
					"Needs Assessment",
					"Online Courses",
					"Teacher Attitudes"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/