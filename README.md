## CertPok API Documentation
### Overview
CertPok is a class that integrates with the CertPok API for managing credentials, templates, pages, and organizations. It provides methods to interact with credentials (e.g., retrieve, issue), retrieve template previews, manage pages, and handle errors efficiently.

#### Class: CertPokError
##### Description
Custom error class used to capture errors related to CertPok operations, extending the native JavaScript Error class.

##### Properties
- statusCode (number): The HTTP status code returned from the request.
- payload (any): The response data or error information.
- name (string): The name of the error (defaults to CertPokError).
##### constructor(statusCode: number, message: string, payload: any)
- statusCode (number): The HTTP status code associated with the error.
- message (string): A description of the error.
- payload (any): Additional information or data related to the error.
### Interfaces
#### Page
Represents a page object that can be used in credentials.

##### Properties
- id (string): The unique identifier for the page.
- name (string): The name of the page.
#### Credential
Represents the structure of a credential object.

##### Properties
- id (string): The unique identifier for the credential.
- state (string): The current state of the credential (e.g., waitingForApproval, processing, emitted, draft, requestingSignature, etc.).
- viewUrl (string, optional): A URL to view the credential.
- createdAt (string, optional): The date and time the credential was created.
- credential (object, optional): Contains information about the credential's tags, emitter, title, emission date, and emission type.
- receiver (object, optional): Contains the name and email of the credential recipient.
#### Organization
Represents an organization in the CertPok system.

##### Properties
- wallet (string): The organization's wallet address.
- name (string): The name of the organization.
- availableCredits (number): The number of credits available to the organization.
- emittedCredentials (number): The number of credentials emitted by the organization.
- sentCredentials (number): The number of credentials sent by the organization.
- draftCredentials (number): The number of draft credentials.
- processingCredentials (number): The number of credentials currently being processed.
#### TemplatePreview
Represents a preview of a template before issuing a credential.

##### Properties
- url (string): The URL where the template preview can be viewed.
#### Template
Represents a template for credentials.

##### Properties
- id (string): The unique identifier of the template.
- name (string): The name of the template.
- version (number, optional): The version number of the template.
- customParameters (array, optional): A list of custom parameters that can be used in the template.

#### Class: CertPok
##### constructor(api_key: string, sandbox: boolean = false)
- api_key (string): The API key used for authentication.
- sandbox (boolean, optional): If set to true, the sandbox environment will be used; otherwise, the live environment is used. Defaults to false.
##### Methods
###### credentialImageUrl(id: string)
Retrieves the URL of a decrypted credential image.

- id (string): The ID of the credential.

Returns: A promise that resolves to a string containing the URL of the credential's image.

###### credential(id: string)
Retrieves the details of a specific credential.

- id (string): The ID of the credential.

Returns: A promise that resolves to a Credential object.
###### emitCredential(id: string, emission_type: 'pok' | 'blockchain', emission_date: string, title: string, first_name: string, last_name: string, tags: string[], identification: string, email: string, page_id: string, lang: string = 'es-AR', emitter: string = 'Excuela')
Emits a new credential.

- id (string): The template ID to be used.
- emission_type ('pok' | 'blockchain'): The emission type of the credential.
- emission_date (string): The emission date in dd/MM/yyyy format.
- title (string): The title for the credential.
- first_name (string): The recipient's first name.
- last_name (string): The recipient's last name.
- tags (array): Tags associated with the credential.
- identification (string): The recipient's identification.
- email (string): The recipient's email.
- page_id (string): The ID of the page for customization.
- lang (string, optional): The language tag for the credential (defaults to 'es-AR').
- emitter (string, optional): The emitter of the credential (defaults to 'Excuela').

Returns: A promise that resolves to the emitted Credential object.
###### organization()
Retrieves details of the current organization.

Returns: A promise that resolves to an Organization object.
###### templatePreview(id: string, emission_type: 'pok' | 'blockchain', emission_date: string, title: string, first_name: string, last_name: string, lang: string = 'es-AR', emitter: string = 'Excuela')
Retrieves a preview of a template for a given emission.

- id (string): The template ID.
- emission_type ('pok' | 'blockchain'): The emission type.
- emission_date (string): The emission date in dd/MM/yyyy format.
- title (string): The title for the credential.
- first_name (string): The recipient's first name.
- last_name (string): The recipient's last name.
- lang (string, optional): The language tag (defaults to 'es-AR').
- emitter (string, optional): The emitter of the credential (defaults to 'Excuela').

Returns: A promise that resolves to a TemplatePreview object containing the preview URL.
###### template(id: string)
Retrieves a template by its ID.

- id (string): The template ID.

Returns: A promise that resolves to a Template object.

###### pages(limit: number = 5)
Retrieves a list of pages with a specified limit.

- limit (number, optional): The number of pages to retrieve (defaults to 5).

Returns: A promise that resolves to an array of Page objects.
###### templates(limit: number = 5)
Retrieves a list of templates with a specified limit.

- limit (number, optional): The number of templates to retrieve (defaults to 5).

Returns: A promise that resolves to an array of Template objects.
Private Methods


#### Error Handling
If an error occurs during any API call, a CertPokError is thrown with the corresponding status code and error payload.