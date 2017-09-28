import { PwaAngularFirebasePage } from './app.po';

describe('pwa-angular-firebase App', () => {
  let page: PwaAngularFirebasePage;

  beforeEach(() => {
    page = new PwaAngularFirebasePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
