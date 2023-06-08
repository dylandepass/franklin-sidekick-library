/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import sinon from 'sinon';
import { expect } from '@open-wc/testing';
import { loadPlugin, unloadPlugin } from '../../src/utils/plugin.js';
import { APP_EVENTS } from '../../src/events/events.js';
import { EventBus } from '../../src/events/eventbus.js';

describe('Plugin Util Tests', () => {
  let appModel;

  beforeEach(() => {
    appModel = {
      appStore: {
        pluginData: null,
        activePluginPath: null,
        activePlugin: null,
        context: {
          baseLibraryOrigin: 'https://main--helix-test-content-onedrive--adobe.hlx.page',
          blocks: 'http://localhost:8001/src/plugins/blocks/blocks.js',
          libraries: {
            blocks: {},
          },
        },
        localeDict: {
          errorLoadingPlugin: 'Error loading plugin',
        },
      },
    };
  });
  describe('loadPlugin', () => {
    it('should load the plugin and update appStore correctly', async () => {
      const eventSpy = sinon.spy();
      const importedPlugin = { default: { title: 'Blocks' } };
      EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_LOADED, eventSpy);
      await loadPlugin(appModel, 'blocks');
      expect(appModel.appStore.pluginData).to.equal(appModel.appStore.context.libraries.blocks);
      expect(appModel.appStore.activePlugin.title).to.equal(importedPlugin.default.title);
      expect(eventSpy.calledOnce).equals(true);
    });
  });

  describe('unloadPlugin', () => {
    it('should unload the plugin and update appStore correctly', () => {
      const eventSpy = sinon.spy();
      EventBus.instance.addEventListener(APP_EVENTS.PLUGIN_UNLOADED, eventSpy);
      unloadPlugin(appModel);
      expect(appModel.appStore.pluginData).equals(undefined);
      expect(appModel.appStore.activePluginPath).equals(undefined);
      expect(appModel.appStore.activePlugin).equals(undefined);
      expect(eventSpy.calledOnce).equals(true);
    });
  });
});
