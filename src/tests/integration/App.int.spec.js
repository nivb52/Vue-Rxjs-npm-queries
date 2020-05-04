import { render, Simulate } from '@testing-library/vue';
import App from '../../App.vue';

// ==================
// INTEGRETIONS
// ==================
describe(' App.vue ', () => {
  it('render the cmp', () => {
    const { getByText } = render(App);
    expect(getByText('Go').textContent).toBe('Go');
  });
});
