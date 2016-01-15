export class App {
  configureRouter(config, router) {
    config.title = 'Route Timer';
    config.map([
      { route: [''], name: 'home', moduleId: 'paths/home', title: 'Home' },
      { route: ['list'], name: 'list', moduleId: 'paths/list', title: 'List' },
      { route: ['new-route'], name: 'new-route', moduleId: 'paths/new-route', title: 'Add New Route'}
    ]);

    this.router = router;
  }
}
