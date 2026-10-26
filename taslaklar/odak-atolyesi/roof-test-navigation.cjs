// Browser-test navigation for the contextual roof inspector. Uses real clicks.
exports.task=async function(page,id){
 await page.click('#roof-task-'+id);
 if(id==='model'&&!await page.locator('#roofLayerTools').evaluate(e=>e.open))await page.click('#roofLayerTools>summary');
};
exports.create=async function(page){
 if(!await page.locator('.roof-create-group').evaluate(e=>e.open))await page.click('.roof-create-group>summary');
 await page.click('#roofFromPlan');
};
