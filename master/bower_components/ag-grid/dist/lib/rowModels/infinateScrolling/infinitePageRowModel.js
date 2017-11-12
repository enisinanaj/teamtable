/**
 * ag-grid - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v9.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var gridOptionsWrapper_1 = require("../../gridOptionsWrapper");
var context_1 = require("../../context/context");
var eventService_1 = require("../../eventService");
var selectionController_1 = require("../../selectionController");
var events_1 = require("../../events");
var sortController_1 = require("../../sortController");
var filterManager_1 = require("../../filter/filterManager");
var constants_1 = require("../../constants");
var infinitePageCache_1 = require("./infinitePageCache");
var beanStub_1 = require("../../context/beanStub");
var InfinitePageRowModel = (function (_super) {
    __extends(InfinitePageRowModel, _super);
    function InfinitePageRowModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InfinitePageRowModel.prototype.getRowBounds = function (index) {
        if (utils_1.Utils.missing(this.virtualPageCache)) {
            return null;
        }
        return this.virtualPageCache.getRowBounds(index);
    };
    InfinitePageRowModel.prototype.init = function () {
        if (!this.gridOptionsWrapper.isRowModelInfinite()) {
            return;
        }
        this.addEventListeners();
        this.setDatasource(this.gridOptionsWrapper.getDatasource());
    };
    InfinitePageRowModel.prototype.isLastRowFound = function () {
        return this.virtualPageCache ? this.virtualPageCache.isMaxRowFound() : false;
    };
    InfinitePageRowModel.prototype.addEventListeners = function () {
        this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_FILTER_CHANGED, this.onFilterChanged.bind(this));
        this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_SORT_CHANGED, this.onSortChanged.bind(this));
    };
    InfinitePageRowModel.prototype.onFilterChanged = function () {
        if (this.gridOptionsWrapper.isEnableServerSideFilter()) {
            this.reset();
        }
    };
    InfinitePageRowModel.prototype.onSortChanged = function () {
        if (this.gridOptionsWrapper.isEnableServerSideSorting()) {
            this.reset();
        }
    };
    InfinitePageRowModel.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    InfinitePageRowModel.prototype.getType = function () {
        return constants_1.Constants.ROW_MODEL_TYPE_INFINITE;
    };
    InfinitePageRowModel.prototype.setDatasource = function (datasource) {
        this.datasource = datasource;
        // only reset if we have a valid datasource to working with
        if (datasource) {
            this.checkForDeprecated();
            this.reset();
        }
    };
    InfinitePageRowModel.prototype.checkForDeprecated = function () {
        var ds = this.datasource;
        // the number of concurrent loads we are allowed to the server
        if (utils_1.Utils.exists(ds.maxConcurrentRequests)) {
            console.error('ag-Grid: since version 5.1.x, maxConcurrentRequests is replaced with grid property maxConcurrentDatasourceRequests');
        }
        if (utils_1.Utils.exists(ds.maxPagesInCache)) {
            console.error('ag-Grid: since version 5.1.x, maxPagesInCache is replaced with grid property maxPagesInPaginationCache');
        }
        if (utils_1.Utils.exists(ds.overflowSize)) {
            console.error('ag-Grid: since version 5.1.x, overflowSize is replaced with grid property paginationOverflowSize');
        }
        if (utils_1.Utils.exists(ds.pageSize)) {
            console.error('ag-Grid: since version 5.1.x, pageSize is replaced with grid property infinitePageSize');
        }
    };
    InfinitePageRowModel.prototype.isEmpty = function () {
        return utils_1.Utils.missing(this.virtualPageCache);
    };
    InfinitePageRowModel.prototype.isRowsToRender = function () {
        return utils_1.Utils.exists(this.virtualPageCache);
    };
    InfinitePageRowModel.prototype.reset = function () {
        // important to return here, as the user could be setting filter or sort before
        // data-source is set
        if (utils_1.Utils.missing(this.datasource)) {
            return;
        }
        // if user is providing id's, then this means we can keep the selection between datsource hits,
        // as the rows will keep their unique id's even if, for example, server side sorting or filtering
        // is done.
        var userGeneratingRows = utils_1.Utils.exists(this.gridOptionsWrapper.getRowNodeIdFunc());
        if (!userGeneratingRows) {
            this.selectionController.reset();
        }
        this.resetCache();
        this.eventService.dispatchEvent(events_1.Events.EVENT_MODEL_UPDATED);
    };
    InfinitePageRowModel.prototype.resetCache = function () {
        var cacheSettings = {
            // the user provided datasource
            datasource: this.datasource,
            // sort and filter model
            filterModel: this.filterManager.getFilterModel(),
            sortModel: this.sortController.getSortModel(),
            // properties - this way we take a snapshot of them, so if user changes any, they will be
            // used next time we create a new cache, which is generally after a filter or sort change,
            // or a new datasource is set
            maxConcurrentDatasourceRequests: this.gridOptionsWrapper.getMaxConcurrentDatasourceRequests(),
            paginationOverflowSize: this.gridOptionsWrapper.getPaginationOverflowSize(),
            paginationInitialRowCount: this.gridOptionsWrapper.getInfiniteInitialRowCount(),
            maxPagesInCache: this.gridOptionsWrapper.getMaxPagesInCache(),
            pageSize: this.gridOptionsWrapper.getInfiniteBlockSize(),
            rowHeight: this.gridOptionsWrapper.getRowHeightAsNumber(),
            // the cache could create this, however it is also used by the pages, so handy to create it
            // here as the settings are also passed to the pages
            lastAccessedSequence: new utils_1.NumberSequence()
        };
        // set defaults
        if (!(cacheSettings.maxConcurrentDatasourceRequests >= 1)) {
            cacheSettings.maxConcurrentDatasourceRequests = 2;
        }
        // page size needs to be 1 or greater. having it at 1 would be silly, as you would be hitting the
        // server for one page at a time. so the default if not specified is 100.
        if (!(cacheSettings.pageSize >= 1)) {
            cacheSettings.pageSize = 100;
        }
        // if user doesn't give initial rows to display, we assume zero
        if (!(cacheSettings.paginationInitialRowCount >= 1)) {
            cacheSettings.paginationInitialRowCount = 0;
        }
        // if user doesn't provide overflow, we use default overflow of 1, so user can scroll past
        // the current page and request first row of next page
        if (!(cacheSettings.paginationOverflowSize >= 1)) {
            cacheSettings.paginationOverflowSize = 1;
        }
        // if not first time creating a cache, need to destroy the old one
        if (this.virtualPageCache) {
            this.virtualPageCache.destroy();
        }
        this.virtualPageCache = new infinitePageCache_1.InfinitePageCache(cacheSettings);
        this.context.wireBean(this.virtualPageCache);
    };
    InfinitePageRowModel.prototype.getRow = function (rowIndex) {
        return this.virtualPageCache ? this.virtualPageCache.getRow(rowIndex) : null;
    };
    InfinitePageRowModel.prototype.forEachNode = function (callback) {
        if (this.virtualPageCache) {
            this.virtualPageCache.forEachNode(callback);
        }
    };
    InfinitePageRowModel.prototype.getCurrentPageHeight = function () {
        return this.virtualPageCache ? this.virtualPageCache.getCurrentPageHeight() : 0;
    };
    InfinitePageRowModel.prototype.getRowIndexAtPixel = function (pixel) {
        return this.virtualPageCache ? this.virtualPageCache.getRowIndexAtPixel(pixel) : -1;
    };
    InfinitePageRowModel.prototype.getPageFirstRow = function () {
        return 0;
    };
    InfinitePageRowModel.prototype.getPageLastRow = function () {
        return this.virtualPageCache ? this.virtualPageCache.getRowCount() - 1 : 0;
    };
    InfinitePageRowModel.prototype.getRowCount = function () {
        return this.virtualPageCache ? this.virtualPageCache.getRowCount() : 0;
    };
    InfinitePageRowModel.prototype.insertItemsAtIndex = function (index, items, skipRefresh) {
        if (this.virtualPageCache) {
            this.virtualPageCache.insertItemsAtIndex(index, items);
        }
    };
    InfinitePageRowModel.prototype.removeItems = function (rowNodes, skipRefresh) {
        console.log('ag-Grid: it is not possible to removeItems when using virtual pagination. Instead use the ' +
            'API to refresh the cache');
    };
    InfinitePageRowModel.prototype.addItems = function (items, skipRefresh) {
        console.log('ag-Grid: it is not possible to add items when using virtual pagination as the grid does not ' +
            'know that last index of your data - instead either use insertItemsAtIndex OR refresh the cache.');
    };
    InfinitePageRowModel.prototype.isRowPresent = function (rowNode) {
        console.log('ag-Grid: not supported.');
        return false;
    };
    InfinitePageRowModel.prototype.refreshVirtualPageCache = function () {
        if (this.virtualPageCache) {
            this.virtualPageCache.refreshVirtualPageCache();
        }
    };
    InfinitePageRowModel.prototype.purgeVirtualPageCache = function () {
        if (this.virtualPageCache) {
            this.virtualPageCache.purgeVirtualPageCache();
        }
    };
    InfinitePageRowModel.prototype.getVirtualRowCount = function () {
        if (this.virtualPageCache) {
            return this.virtualPageCache.getVirtualRowCount();
        }
        else {
            return null;
        }
    };
    InfinitePageRowModel.prototype.isMaxRowFound = function () {
        if (this.virtualPageCache) {
            return this.virtualPageCache.isMaxRowFound();
        }
    };
    InfinitePageRowModel.prototype.setVirtualRowCount = function (rowCount, maxRowFound) {
        if (this.virtualPageCache) {
            this.virtualPageCache.setVirtualRowCount(rowCount, maxRowFound);
        }
    };
    InfinitePageRowModel.prototype.getVirtualPageState = function () {
        if (this.virtualPageCache) {
            return this.virtualPageCache.getPageState();
        }
        else {
            return null;
        }
    };
    return InfinitePageRowModel;
}(beanStub_1.BeanStub));
__decorate([
    context_1.Autowired('gridOptionsWrapper'),
    __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)
], InfinitePageRowModel.prototype, "gridOptionsWrapper", void 0);
__decorate([
    context_1.Autowired('filterManager'),
    __metadata("design:type", filterManager_1.FilterManager)
], InfinitePageRowModel.prototype, "filterManager", void 0);
__decorate([
    context_1.Autowired('sortController'),
    __metadata("design:type", sortController_1.SortController)
], InfinitePageRowModel.prototype, "sortController", void 0);
__decorate([
    context_1.Autowired('selectionController'),
    __metadata("design:type", selectionController_1.SelectionController)
], InfinitePageRowModel.prototype, "selectionController", void 0);
__decorate([
    context_1.Autowired('eventService'),
    __metadata("design:type", eventService_1.EventService)
], InfinitePageRowModel.prototype, "eventService", void 0);
__decorate([
    context_1.Autowired('context'),
    __metadata("design:type", context_1.Context)
], InfinitePageRowModel.prototype, "context", void 0);
__decorate([
    context_1.PostConstruct,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfinitePageRowModel.prototype, "init", null);
__decorate([
    context_1.PreDestroy,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfinitePageRowModel.prototype, "destroy", null);
InfinitePageRowModel = __decorate([
    context_1.Bean('rowModel')
], InfinitePageRowModel);
exports.InfinitePageRowModel = InfinitePageRowModel;
