export type SwaggerType = 'swagger' | 'index';
export type SwaggerStatus =
  | {
      state: 'idle';
      url: null;
      error: undefined;
      type: SwaggerType;
    }
  | {
      state: 'success';
      url: string;
      error: null;
      type: SwaggerType;
    }
  | {
      state: 'error';
      url: string;
      error: string;
      type: SwaggerType;
    };

export function checkSwagger(url: string | null): SwaggerStatus {
  if (url === null) {
    return { state: 'idle', url: null, error: undefined, type: 'swagger' };
  }

  if (!URL.canParse(url)) {
    return { state: 'error', url: url, error: 'Invalid URL', type: 'swagger' };
  }

  if (url.includes('swagger') && url.endsWith('/index.html')) {
    return { state: 'success', url: url, error: null, type: 'index' };
  }

  const objectUrl = new URL(url);
  if (objectUrl.hostname === 'validator.swagger.io') {
    const cleanUrl = objectUrl.searchParams.get('url');

    if (!cleanUrl) {
      return {
        state: 'error',
        url: url,
        error: 'No URL provided in validator.swagger.io',
        type: 'swagger',
      };
    }

    return checkSwagger(cleanUrl);
  }

  if (!url.endsWith('/swagger.json')) {
    return {
      state: 'error',
      url: url,
      error: 'Not a Swagger JSON endpoint',
      type: 'swagger',
    };
  }

  return { state: 'success', url: url, error: null, type: 'swagger' };
}
