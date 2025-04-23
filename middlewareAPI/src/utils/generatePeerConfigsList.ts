import PeerConfig from "../gRPC/peerConfig";
import envOrDefault from "./envOrDefault";

export default function generatePeerConfigsList(): PeerConfig[] {
    const peers: PeerConfig[] = []

    for (let x = 1; x <= 4; x++) {
        peers.push({
            url: envOrDefault(`PEER${x}_ENDPOINT`, ''),
            tlsCertPath: envOrDefault(`PEER${x}_TLS_CERTIFICATE_PATH`, ''),
            hostAlias: envOrDefault(`PEER${x}_HOST_ALIAS`, '')
        })
    }

    return peers
}