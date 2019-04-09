# vuejs-json-dashboardify
Create a client-side VueJS component which reads JSON from a GET endpoint and renders into the GovUK Frontend template dynamically including containers, grid rows headers, content and tables. This is to be used to render dynamic content from a static S3-backed server.

## Setup

If you want to view the example you should run 
`npm install` and then 
`gulp` to load the govuk-frontend and build the css. 

Then you can run the code with an npm http server 
`http-server . -a 127.0.0.1 -p 8000`

## Invoke the component

Once you've got all the scripts loading correctly you can 
use the component by just including something like this 
in your page. 

You can see the HTML elements supported in the example file 
[example.json](example.json). The only restriction is that 
the top level component in the JSON has to be a div of some 
sort. 

```HTML
<json-dashboardify-url-element 
    source="/example.json">
</json-dashboardify-url-element>
```

## TODO 
This is all a bit clumsy at the moment. 

I think the next steps are to turn the pe-charts table-chart 
into a proper VueJS component so it can be included inline.

 