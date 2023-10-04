# Section

A page is an array of sections. A section is a component with these properties:

1. `code` - a unique identifier for the section that will be key to maintain compatibility over time. In this project we use the component's file name as the code. It has to start with an uppercase letter and can only contain letters and numbers.
1. `title` - a small descriptive title for the section.
1. `desc` - an optional description for the section.
1. `order` - a float that when sorted will determine the order of the sections in the page.
1. `config` - props to the section component as json.
1. `Component` - the component to render.
1. `schema` - a json schema for the config for the section.
1. `uiSchema` - an optional schema from JSONForms to render the config form.

## Things to remember

- Server components can embed client components.
- Client components can only embed Server components as children.
