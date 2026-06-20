## TODO - Fix “Failed to upload image”

- [ ] Add robust upload path resolution so it always writes inside the project directory.
- [ ] Prevent hard failures on platforms where the filesystem is read-only; optionally log a clearer error.
- [ ] Update `app/api/admin/upload/route.ts` to use an absolute path based on the project root.
- [ ] Re-test admin product image upload from the UI.

