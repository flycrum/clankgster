import { describe, expect, test } from 'vite-plus/test';
import { clankgstersConfigDefaults } from '../configs/clankgsters-config.defaults.js';
import { syncSourceLayouts } from './sync-source-layouts.js';

const sourceDefaults = clankgstersConfigDefaults.CONSTANTS.sourceDefaults;

describe('syncSourceLayouts', () => {
  test('getResolvedSourcePath normalizes sourceDir (backslashes, trailing slashes) like .clank', () => {
    const expected = syncSourceLayouts.getResolvedSourcePath({
      ...sourceDefaults,
      sourceDir: '.clank',
    });
    expect(
      syncSourceLayouts.getResolvedSourcePath({
        ...sourceDefaults,
        sourceDir: '.clank\\',
      })
    ).toEqual(expected);
    expect(
      syncSourceLayouts.getResolvedSourcePath({
        ...sourceDefaults,
        sourceDir: '.clank//',
      })
    ).toEqual(expected);
  });
});
