const datatext = `
サンプルプロジェクト
	Define Chart API data{res:Mario,notes:Some Notes text}
		Chart Object data{start:2019-06-20,end:2019-07-20,pMile:1,res:Henrique,comp:100}
		Task Objects data{res:Henrique,comp:40}
			<a href='yahoo.com'>Constructor Proc #1234 of February 2019</a> data{id:121,start:2019-06-21,end:,res:Pedro,comp:60,pDuration:3 days}
			Task Variables data{id:122,start:2019-07-06,end:2019-07-11,res:Mario John Silva,comp:60,depend:121}
			Task by Minute/Hour data{id:123,start:2019-07-01,end:2019-07-15 12:00,res:Mario,comp:60}
			Test Plan End data{start:2019-07-09,end:2019-07-29,pPlanStart:2019-07-09,pPlanEnd:2019-09-29,res:Anyone,comp:60,depend:123,pCaption:This is a caption,pNotes:null,pCost:34}
	Create HTML Shell data{start:2019-07-24,end:2019-07-24,res:Mario,comp:20,depend:122}
	Code Javascript data{res:Mario}
		Define Variables data{start:2019-06-25,end:2019-07-17,pPlanStart:2019-06-24,pPlanEnd:2019-07-15 12:00,res:Mario,comp:30}
		Calculate One Day data{start:2019-07-15 00:00,end:2019-07-16 00:00,res:Henrique,comp:40}
		Draw Task Items data{res:Someone,comp:40}
			Task Label Table data{id:332,start:2019-07-06,end:2019-07-09,res:Mario,comp:60}
			Task Scrolling Grid data{id:333,start:2019-07-11,end:2019-07-20,res:Mario,depend:332}
		Draw Task <i>Bars</i> data{res:Anybody,comp:67}
			Test Bar Task data{start:2019-03-26,end:2019-04-11,res:Mario,comp:60,pBarText:this is a bar text}
			Calculate Start/Stop data{id:A342,start:2019-04-12,end:2019-05-18,res:Mario,comp:60}
			Draw Task Div data{id:343,start:2019-05-13,end:2019-05-17,res:Mario,comp:60}
			Draw Completion Div data{start:2019-05-17,end:2019-06-04,res:Mario,comp:60,depend:A342,343}
		Just plan dates data{pPlanStart:2019-07-17,pPlanEnd:2021-09-15,res:Mario,depend:333}
		Just dates data{start:2019-07-17,end:2021-09-15,res:Mario,depend:333}
`