import handlebars from 'handlebars';

import IMailTemplateProvider from '../models/IMailTemplateProvider';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default class HandlebarsMailTemplateProvider
    implements IMailTemplateProvider {
    public async parse({
        template,
        variables,
    }: IParseMailTemplateDTO): Promise<string> {
        const parseTemplate = handlebars.compile(template);

        return parseTemplate(variables);
    }
}
