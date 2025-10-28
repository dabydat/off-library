import { Injectable } from '@nestjs/common';
import {
    HandlerDetectorStrategy,
    RpcHandlerDetector,
    ValueObjectHandlerDetector,
    DomainHandlerDetector,
    HttpHandlerDetector,
    DefaultHandlerDetector,
} from './handler-detector.strategy';

@Injectable()
export class HandlerDetectorService {
    private readonly detectors: HandlerDetectorStrategy[];

    constructor() {
        this.detectors = [
            new RpcHandlerDetector(),           // Check RPC first (most specific)
            new ValueObjectHandlerDetector(),   // Then ValueObject
            new DomainHandlerDetector(),        // Then Domain
            new HttpHandlerDetector(),          // Then HTTP
            new DefaultHandlerDetector(),       // Finally default (always matches)
        ];
    }

    detect(exception: any): string {
        const detector = this.detectors.find(d => d.canDetect(exception));
        return detector?.getHandlerName(exception) || 'UnknownHandler';
    }

    registerDetector(detector: HandlerDetectorStrategy, position: number = 0): void {
        this.detectors.splice(position, 0, detector);
    }
}