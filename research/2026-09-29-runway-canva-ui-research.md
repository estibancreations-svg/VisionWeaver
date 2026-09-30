# Runway and Canva for UI Mockup Creation

## What are Runway's video generation capabilities for UI/mockup animation?

### Takeaway
Runway Gen-4.5 supports text-to-video and image-to-video generation from static images and text prompts, emphasizing realistic motion rendering and cinematic quality. The platform launched a public API in September 2024 to enable programmatic access to these video generation models, particularly suited for automating UI walkthroughs and animated mockups.

### Cited Findings
- Runway released a public API in September 2024 to expand programmatic access to its video generation models — [Runway Announces API for Generative AI Video Services](https://www.maginative.com/article/runway-announces-api-for-generative-ai-video-services/)
- Gen-4.5 is "an AI video generation model that creates short video clips from text prompts or static images with high visual fidelity and smooth motion" — [Runway Gen-4.5 Documentation](https://runware.ai/docs/models/runway-gen-4-5/guides)
- Gen-4.5 core capabilities include: text-to-video generation, image-to-video generation, multiple aspect ratio options, and variable clip durations — [Runway Gen-4.5 Guides](https://runware.ai/docs/models/runway-gen-4-5/guides)
- Runway Dev offers "Cinematic video up to 30 seconds with a large reference budget for images, videos, and audio" through Seedance 2.5 model — [Runway Dev API Documentation](https://docs.dev.runwayml.com/index.md)
- The platform has been used by major technology companies for large-scale video generation operations — [Runway Dev API Documentation](https://docs.dev.runwayml.com/index.md)

### Inferences
- Image-to-video capabilities make Runway suitable for automating UI mockup creation: design UI screenshots can be converted to animated walkthroughs by prompting motion sequences
- The "large reference budget" for images suggests the API can accept high-quality UI mockups as input without strict resolution restrictions
- Variable clip durations and multiple aspect ratios enable flexibility in generating mockups for different screen sizes and interaction flows
- 30-second maximum video length is sufficient for typical UI workflow demos but may require segmentation for longer end-to-end product walkthroughs

### Gaps
- Specific technical specifications for Gen-4.5 (native resolution output, frame rate, frame consistency) are not documented in available sources
- No information found on whether Runway API accepts batch/bulk requests for generating multiple UI mockup variations
- Cost per request and credit consumption rates for the public API are not documented in accessible sources
- No guidance on input image quality requirements or preprocessing needed for UI screenshots

## What video quality/resolution/frame rates does Runway support?

### Takeaway
Runway's maximum supported video output is up to 30 seconds for Seedance 2.5, with support for 1080p video generation. However, specific frame rate, default resolution, and output codec information for Gen-4.5 and other models are not available in public documentation.

### Cited Findings
- Seedance 2.5 supports "1080p video up to 30 seconds" — [Runway Dev API Documentation](https://docs.dev.runwayml.com/index.md)
- Gen-4.5 model emphasizes "realistic motion rendering, strong adherence to user prompts, and controllable composition" but specific resolution/frame rate specs are not detailed — [Runway Gen-4.5 Documentation](https://runware.ai/docs/models/runway-gen-4-5/guides)

### Inferences
- 1080p is the stated maximum output resolution, which is suitable for desktop UI mockups and web demonstrations
- 30-second limit suggests videos are optimized for rapid generation but longer product demos would require multi-part generation or segmentation
- Frame rate not specified suggests Runway may use platform defaults (likely 24fps, 30fps, or 60fps for web/UI content)

### Gaps
- Gen-4.5 specific resolution and frame rate capabilities not found
- No documentation on whether different models support different resolutions (e.g., 720p, 4K variants)
- No information on output codec support (H.264, H.265, VP9, etc.) or container formats besides general "MP4" references
- Unclear if resolution/frame rate can be specified per-request or if they are model-specific fixed values
- No documentation on video quality settings or compression options

## How does Canva's design API work for programmatic creation?

### Takeaway
Canva offers two integration pathways: the Apps SDK for editor-based workflows and Connect APIs (REST-based) for external application integration. Connect APIs enable programmatic design creation, export automation, and asset management. However, the Apps SDK's design creation method is currently geographically limited to China, while REST API endpoints focus on export and design retrieval rather than native programmatic design generation.

### Cited Findings
- Canva provides "two pathways: the Apps SDK (runs within Canva's editor) and Connect APIs (integrates into external applications)" — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)
- Connect APIs provide "Asset management, design automation, and data syncing capabilities" suited for off-platform integration — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)
- `createDesign` method "Creates a new design in the Canva editor" but is "only available for users in China" — [Canva Create Design API](https://www.canva.dev/docs/button/javascript/api-reference/create-design)
- `createDesign` method parameters include: `opts.design.type` (required: design format like "Poster"), `opts.design.dimensions` (optional), `opts.design.title` (optional), `opts.editor.fileType` (export format: png, pdf, jpeg, mp4, gif), and callback handlers (onDesignOpen, onDesignPublish, onDesignClose) — [Canva Create Design API](https://www.canva.dev/docs/button/javascript/api-reference/create-design)
- Authentication uses "OAuth 2.0" with PKCE (Proof Key for Code Exchange) flow recommended — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)

### Inferences
- Canva's REST APIs are designed for export automation and design retrieval rather than direct programmatic design generation, limiting use cases for automated UI mockup creation
- The geographic limitation of `createDesign` to China suggests this API method may be in pilot/beta, limiting broader adoption for international teams
- Export format support (including MP4 and GIF) indicates Canva designs can be rendered as animated video, though generation workflow details are unclear
- Two-tier API architecture (Apps SDK vs. Connect APIs) suggests different capabilities: Apps SDK may support richer design creation workflows while Connect APIs handle integrations

### Gaps
- No REST API endpoint found for programmatic design creation from scratch; existing endpoints appear read/export-focused
- No documentation on how Canva generates animated MP4/GIF exports from static designs (manual keyframing required, or automatic motion inference?)
- No specification of design template categories or how to query/select design types programmatically
- Rate limits documented only for export (10 req/10s) and native element addition (20 req/10s); no limits specified for design creation/retrieval
- No examples of full workflow: creating design → adding elements → exporting → retrieving output

## What are the authentication and rate limits for both services?

### Takeaway
**Runway:** Uses bearer token authentication via API key; specific rate limits not publicly documented.
**Canva:** Uses OAuth 2.0 with PKCE flow; documented rate limits are Design Request Export API (10 requests per 10 seconds) and Design Add Native Element API (20 requests per 10 seconds). Additional endpoints may have different limits.

### Cited Findings

#### Runway Authentication & Rate Limits
- Runway uses bearer token authentication for API access — [Runway API Reference](https://help.runway.com/api-reference/tbzXnwKFBfTzmqnrhyttv2/authentication/75ULcjGqG49iNT5gVXcfzP)
- Specific request-per-minute or requests-per-second rate limits for Runway's public API are not publicly documented in accessible sources

#### Canva Authentication & Rate Limits
- Canva requires "OAuth 2.0" authentication, with PKCE flow recommended for enhanced security — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)
- "Design Request Export API: 10 requests every 10 seconds" — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)
- "Design Add Native Element API: 20 requests every 10 seconds" — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)
- `GET https://api.canva.com/rest/v1/designs/{designId}/export-formats` requires `design:content:read` scope and has "Rate Limit: 100 requests per minute per app user" — [Canva Export Formats API](https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-export-formats/)
- Best practices recommend "never storing tokens in client-side code" and using "server-side secure storage (databases) with proper encryption" — [Dev.to: Canva API Comprehensive Guide](https://dev.to/zuplo/canva-api-a-comprehensive-guide-513j)

### Inferences
- Canva's rate limits vary by endpoint (10 req/10s for export, 20 req/10s for element addition, 100 req/min for format query), requiring careful request queuing for batch operations
- OAuth 2.0 with PKCE is standard for user-delegated access, but server-to-server API authentication for Canva is not detailed in fetched sources
- Runway's lack of published rate limits suggests either per-tier customization or that limits are managed via credit/quota system rather than request frequency
- Both services recommend server-side token storage, indicating integration should happen via backend microservices, not client-side SDKs

### Gaps
- Runway's public API rate limits, throttling behavior, and per-tier quota specifications not found
- Canva OAuth token refresh workflow and token expiration details not documented in fetched sources
- No information on whether Canva rate limits apply per user, per app, or per API key across multiple users
- Runway pricing/credit model not detailed; unclear if rate limits are enforced or if quota is credit-based
- No documentation on API error responses, retry behavior, or backoff strategies for either service

## What file formats and export options are available?

### Takeaway
**Runway:** Outputs video files (MP4 primary format mentioned); accepts images, video, and audio files as input with specific codec/format requirements. No detailed output codec options documented.
**Canva:** Exports in multiple formats including PDF, JPG, PNG, SVG, PPTX, GIF, MP4, and HTML Bundle/Standalone. Export capabilities vary by design type and page content.

### Cited Findings

#### Runway Input & Output Formats
- Runway accepts "image, video, and audio formats and codecs" as input — [Runway Supported File Types](https://help.runwayml.com/hc/en-us/articles/4402453019795)
- Video output is referenced in context of MP4 format in workflow documentation — [ComfyUI Runway Video Generation](https://docs.comfy.org/tutorials/partner-nodes/runway/video-generation)
- No specific output codec documentation (H.264 vs H.265, bitrate options) found in accessible sources

#### Canva Export Formats
- Supported export formats: "PDF, JPG, PNG, SVG" (image formats), "PPTX" (PowerPoint), "GIF, MP4" (animation formats), "HTML Bundle & Standalone" (web formats), "CSV" (data) — [Canva Export Formats Endpoint](https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-export-formats/)
- "The available export formats depend on the design type and the types of pages in the design" — [Canva Export Formats Endpoint](https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-export-formats/)
- `createDesign` API supports optional `opts.editor.fileType` parameter: "png, pdf, jpeg, mp4, gif" — [Canva Create Design API](https://www.canva.dev/docs/button/javascript/api-reference/create-design)
- Export endpoint: `GET https://api.canva.com/rest/v1/designs/{designId}/export-formats` — [Canva Export Formats Endpoint](https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-export-formats/)

### Inferences
- Runway's accepted input formats likely include PNG, JPG for images and MOV, MP4 for videos, but specific codec matrix not documented
- Canva's GIF and MP4 output suggests designs can be animated, though the animation mechanism (keyframe interpolation, page transitions, element motion) is unclear
- Canva's format availability matrix (varying by design type) means UI mockup workflows must query export formats before requesting generation
- PPTX export suggests Canva can structure multi-slide designs, useful for multi-screen UI mockups

### Gaps
- Runway input codec specification (e.g., H.264, H.265, VP9 support) not documented
- Runway output codec options and bitrate/quality settings not specified
- Canva animation generation method not explained: does it interpolate between static designs or require keyframe animation to be built in?
- No documentation on MP4/GIF quality settings, frame rate, or resolution for animated exports
- Unclear if Canva's HTML export can include interactive elements or is purely static markup

## Can Canva designs be animated/rendered as video in Runway?

### Takeaway
A partnership between Canva and Runway was announced for generative AI video creation, indicating integrations exist or are in development. Canva natively supports MP4 and GIF export, suggesting designs can be converted to video. However, specific technical documentation on the Canva→Runway workflow is not available in public sources.

### Cited Findings
- "Canva partners with Runway to create generative AI videos" — [Analytics India Mag: Canva Runway Partnership](https://analyticsindiamag.com/canva-partners-with-runway-to-create-generative-ai-videos/)
- Canva supports exporting designs in "GIF, MP4" formats — [Canva Export Formats Endpoint](https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-export-formats/)
- "How to Animate Your Canva Designs" guides exist, indicating animation support within Canva itself — [LottieFiles: Animate Canva Designs](https://lottiefiles.com/blog/tips-and-tutorials/how-to-create-animated-canva-designs)

### Inferences
- Canva's native MP4/GIF export may provide raw material for Runway video generation workflows (export design → feed to Runway as reference image → Runway generates motion video)
- The Canva-Runway partnership likely enables: design in Canva → export → use as reference for Runway Gen-4.5 image-to-video → generate animated UI mockup
- LottieFiles integration with Canva suggests Canva supports Lottie animation format, which could be exported and used with Runway
- Integration likely occurs at application level (external orchestration) rather than native API-to-API embedding

### Gaps
- No technical documentation on the specific Canva-Runway partnership implementation
- Unclear whether the partnership provides a direct Canva→Runway export button/workflow or requires manual export+upload steps
- No documentation on prompt engineering for Runway when using Canva designs as reference images
- Unclear if Canva's animation format (Lottie or other) is compatible with Runway's input requirements
- No pricing or feature tier information for the Canva-Runway integrated workflow

---

## Summary of Findings

### Runway Strengths for UI Mockup Generation
- Gen-4.5 supports both text-to-video and image-to-video workflows, enabling UI screenshot → animated demo automation
- Up to 30 seconds of 1080p video output
- Public API launched September 2024 for programmatic access
- Suitable for cinematic UI walkthroughs emphasizing motion and interaction

### Runway Limitations
- Specific resolution/frame rate/codec details not publicly documented
- Rate limits not published; likely managed via credit system
- 30-second maximum may require segmentation for long product demos
- No batch/bulk request documentation

### Canva Strengths for UI Mockup Design
- REST API for export automation and design retrieval
- Multiple export formats including MP4, GIF, and SVG for downstream processing
- OAuth 2.0 authentication with PKCE security
- Connect API architecture separates design creation from export, enabling flexible workflows

### Canva Limitations
- No REST API endpoint for programmatic design creation from scratch
- `createDesign` method limited to China geographically
- Rate limits vary by endpoint (10-100 req/min depending on operation)
- Animation generation mechanism unclear; no documented pipeline for motion synthesis

### Integration Approach
- **Recommended workflow:** Design UI in Canva → Export as PNG/SVG → Use as reference image input to Runway Gen-4.5 → Generate animated mockup video
- Partnership exists but technical details are not publicly documented
- Application-level orchestration likely required (external service coordinates Canva export + Runway API calls)
- No native bi-directional API integration found in public documentation

### Research Limitations
- Specific technical specifications (resolution, frame rate, codec) for Runway Gen-4.5 are not in public documentation
- Canva's animation/MP4 generation mechanism is not documented; unclear if it's template-based or AI-generated
- Neither service's cost model or credit consumption rates are publicly detailed
- Rate limiting behavior for high-volume/production use cases not documented
