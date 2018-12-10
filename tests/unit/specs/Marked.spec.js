import { mount } from '@vue/test-utils'
import Marked from '@/components/layouts/Marked'

const plainText = `# A List

- Lorem ipsum dolor sit amet, consectetur adipisicing elit.
- Deleniti dolor nulla cupiditate omnis nesciunt modi, quae minus nam debitis illum.
- Nostrum rerum quisquam, cumque est reprehenderit eos natus pariatur odio.
- A simple link: https://www.github.com

---

Just a paragraph with **bold**, *italic* and emoji :smiley:`

describe('Marked', () => {
  const wrapper = mount(Marked, {
    propsData: { plainText }
  })

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<h1 id="a-list">A List</h1>')
  })

  it('has a list with three items', () => {
    expect(wrapper.find('ul').is('ul')).toBe(true)
    expect(wrapper.findAll('ul > li').length).toBe(4)
  })

  it('has a link', () => {
    expect(wrapper.find('a').is('a[href]')).toBe(true)
  })

  it('opens link to new tab', () => {
    expect(wrapper.find('a').is('a[target]')).toBe(false)
    wrapper.setProps({ openLinkNewTab: true })
    expect(wrapper.find('a').is('a[target]')).toBe(true)
  })

  it('has a paragraph, bold and italic', () => {
    expect(wrapper.find('p').is('p')).toBe(true)
    expect(wrapper.find('strong').is('strong')).toBe(true)
    expect(wrapper.find('em').is('em')).toBe(true)
  })

  it('has an emoji by default', () => {
    expect(wrapper.find('.emoji').is('img')).toBe(true)
  })

  it('set emoji to false', () => {
    expect(wrapper.find('.emoji').is('img')).toBe(true)
    wrapper.setProps({ emoji: false })
    expect(wrapper.findAll('.emoji').length).toBe(0)
    expect(wrapper.text()).toContain(':smiley:')
  })

  it('has a horizontal line between the list and the paragraph', () => {
    expect(wrapper.find('hr').is('hr')).toBe(true)
    expect(wrapper.find('ul + hr + p').is('ul + hr + p')).toBe(true)
  })
})
