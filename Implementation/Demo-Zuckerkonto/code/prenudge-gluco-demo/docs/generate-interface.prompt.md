# generate-interface.prompt.md
Purpose:
Convert an example JSON object into a TypeScript interface and Jest-style unit test skeleton.

Instructions:
- Read the provided JSON object.
- Output:
  1. A TypeScript `interface` with appropriate types.
  2. A small factory function `make<Thing>(overrides?: Partial<Thing>): Thing`.
  3. A Jest test skeleton that asserts the factory produces required fields.

Example:
Input JSON:
{
  "id": "2715f524-2ae8-4ac1-81ed-27c448dbdf2b",
  "resourceType": "Observation",
  "status": "final",
  "valueQuantity": { "value": 40, "unit": "mg/dl" }
}

Expected outputs: `Observation` interface, `makeObservation` factory, `observation.test.ts` skeleton.
