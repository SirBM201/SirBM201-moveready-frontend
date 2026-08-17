# B02 design decision

The Passport explorer already renders backend destination `source_status`, safety notes and source links. B02 therefore does not duplicate the explorer or create a second Passport results engine. It adds a first-class provenance explanation and reusable status presentation primitives while preserving the existing destination-check flow.

This is additive by design: provider discovery remains useful, while the user is taught that only a current backend-controlled `verified` state represents MoveReady-reviewed official evidence. B01/038 owns promotion and expiry; frontend owns explanation and presentation.
