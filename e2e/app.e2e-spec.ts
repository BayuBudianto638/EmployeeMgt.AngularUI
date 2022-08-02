import { EmployeeMgtTemplatePage } from './app.po';

describe('EmployeeMgt App', function() {
  let page: EmployeeMgtTemplatePage;

  beforeEach(() => {
    page = new EmployeeMgtTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
