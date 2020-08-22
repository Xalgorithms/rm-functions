/**
 * @file
 *
 * Contains the primary XA Rule schema, which will be enforced for all incoming and modified rules.
 */

export const RuleSchema = {
    __metadata: 'Non-computational information about the creation and ownership of the rule',
    metadata: {
        __rule: 'Information about the rule',
        rule: {
            title: 'Simple Rule',
            __title: 'The title of the rule',
            description: 'This is a simple rule that determines the required xyz for a given abc.',
            __description: 'A brief description of the rule',
            __authors: 'An array of author information, including name and contact info',
            authors: [
                {
                    name: 'Ryan Fleck',
                    __name: "The authors's full plaintext name",
                    email: 'Ryan.Fleck@protonmail.com',
                    __email: "The author's email address",
                    solid_profile: 'https://ryanfleck.solid.community/profile/card#me',
                    __solid_profile: 'Full address to personal solid profile',
                },
            ],
        },
    },
};
