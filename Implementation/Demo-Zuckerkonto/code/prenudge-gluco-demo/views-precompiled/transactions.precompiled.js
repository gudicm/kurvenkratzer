(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['transactions'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"measurements-empty\">\r\n        Du hast noch keine Einzahlungen gemacht.<br/>\r\n        Zahle noch heute auf dein Konto ein, um unglaubliche Prämien zu gewinnen.\r\n    </div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <ol class=\"list-group\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"latestMeasurements") : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":59,"column":17}}})) != null ? stack1 : "")
    + "    </ol>\r\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.lambda, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <li class=\"list-group-item d-flex justify-content-between align-items-start\">\r\n                <div>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"syncedToPrenudge") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":13,"column":20},"end":{"line":19,"column":27}}})) != null ? stack1 : "")
    + "                </div>\r\n                <div class=\"ms-2 me-auto\" style=\"overflow: auto\">\r\n                    <div class=\"fw-bold mb-1\">Einzahlung</div>\r\n                    <div>\r\n                        "
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"subinfo") : depth0), depth0))
    + "\r\n                    </div>\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"isusersubject") : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":20},"end":{"line":30,"column":31}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"outcomeOk") : depth0),{"name":"unless","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":20},"end":{"line":36,"column":31}}})) != null ? stack1 : "")
    + "\r\n                    "
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"formattedDate") : depth0), depth0))
    + "\r\n                </div>\r\n                <div class=\"text-center\">\r\n                    <div class=\"measurement-value badge\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isInRange") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(15, data, 0),"data":data,"loc":{"start":{"line":42,"column":20},"end":{"line":46,"column":27}}})) != null ? stack1 : "")
    + "                    rounded-pill\">"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"value") : depth0), depth0))
    + "\r\n                        mg/dl\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isLower") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":24},"end":{"line":51,"column":31}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isUpper") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":24},"end":{"line":54,"column":31}}})) != null ? stack1 : "")
    + "                    </div>\r\n                    <div class=\"text-muted\">"
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"targetBgLower") : depth0), depth0))
    + " bis "
    + alias3(alias2((depth0 != null ? lookupProperty(depth0,"targetBgUpper") : depth0), depth0))
    + " mg/dl</div>\r\n                </div>\r\n            </li>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                        <img class=\"measurement-icon\" src=\"/images/prenudge_notext.png\"\r\n                             alt=\"Mit PreNudge synchronisiert\"/>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "                        <img class=\"measurement-icon filter-bw\" src=\"/images/prenudge_notext.png\"\r\n                             alt=\"Nicht mit PreNudge synchronisiert\"/>\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                        <div>\r\n                            <b class=\"text-danger\">Subject anders!</b>\r\n                        </div>\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                        <div>\r\n                            <b class=\"text-danger\">FHIR Fehler - "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"status") : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"statusText") : depth0), depth0))
    + "</b><br/>\r\n                            <pre>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"fhirOutcomeJson") : depth0), depth0))
    + "</pre>\r\n                        </div>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "                    text-bg-success\r\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "                    text-bg-warning\r\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"bi bi-arrow-down-circle ms-2\" title=\"Unter dem Zielbereich!\"></i>\r\n";
},"19":function(container,depth0,helpers,partials,data) {
    return "                            <i class=\"bi bi-arrow-up-circle ms-2\" title=\"Über dem Zielbereich!\"></i>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"latestMeasurements") : depth0)) != null ? lookupProperty(stack1,"length") : stack1),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":11}}})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"latestMeasurements") : depth0)) != null ? lookupProperty(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":61,"column":7}}})) != null ? stack1 : "");
},"useData":true});
})();